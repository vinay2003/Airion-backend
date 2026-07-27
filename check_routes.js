const fs = require('fs');
const path = require('path');

const apiDir = '/Users/rishabh/Airion-backend/apps/api/src';

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

const controllers = walkSync(apiDir).filter(f => f.endsWith('.controller.ts'));

const endpointsToCheck = [
    '/vendors/gallery', '/vendors/gallery-purge',
    '/merchandise/vendor/orders', '/merchandise/vendor/orders/:id/status',
    '/uploads/image', '/vendors/ads', '/ads/vendor/me', '/ads',
    '/vendors/:id/stats/bookings', '/vendors/:id/earnings', '/vendors/me/profile-views',
    '/auth/signup/send-otp', '/auth/signup/verify-otp', '/vendors/me', '/vendors',
    '/merchandise', '/services', '/bookings/vendor', '/bookings/:id/status',
    '/subscriptions/plans', '/subscriptions/checkout', '/subscriptions/cancel',
    '/availability/vendor/:id', '/availability/block', '/auth/profile',
    '/reviews/vendor/:id', '/reviews/:id/reply'
];

let allRoutes = [];
controllers.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const controllerMatch = content.match(/@Controller\('([^']+)'\)/);
    const controllerBase = controllerMatch ? controllerMatch[1] : '';

    const methods = ['Get', 'Post', 'Put', 'Patch', 'Delete'];
    methods.forEach(method => {
        const regex = new RegExp(`@${method}\\('([^']*)'\\)`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
            const route = `/${controllerBase}${match[1] ? '/' + match[1] : ''}`.replace(/\/+/g, '/');
            allRoutes.push({ method, route, file: path.basename(file) });
        }
        // Check for empty @Method()
        const emptyRegex = new RegExp(`@${method}\\(\\s*\\)`, 'g');
        while ((match = emptyRegex.exec(content)) !== null) {
            const route = `/${controllerBase}`;
            allRoutes.push({ method, route, file: path.basename(file) });
        }
    });
});

endpointsToCheck.forEach(ep => {
    const isFound = allRoutes.some(r => {
        // Convert express style params to ignore exact match
        const routeRegex = new RegExp('^' + r.route.replace(/:[^\s/]+/g, '.*') + '$');
        return routeRegex.test(ep.replace(/:[^\s/]+/g, 'testId'));
    });
    console.log(`Endpoint ${ep}: ${isFound ? 'FOUND' : 'NOT FOUND'}`);
});
