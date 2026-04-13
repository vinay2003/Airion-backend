/**
 * @ease2event/ui — Barrel Export
 *
 * Import components:
 *   import { Button, Card, Input, Badge, Avatar, Spinner } from '@ease2event/ui';
 *
 * Import styles (in your index.css):
 *   @import "@ease2event/ui/globals.css";
 */

// Components
export { Button } from './components/Button';
export { Card, CardHeader, CardTitle, CardBody, CardFooter } from './components/Card';
export { Input } from './components/Input';
export { Badge } from './components/Badge';
export { Avatar } from './components/Avatar';
export { Spinner } from './components/Spinner';
export { Skeleton, SkeletonText } from './components/Skeleton';
export { Modal } from './components/Modal';
export { Dropdown } from './components/Dropdown';
export { Table } from './components/Table';
export { Tabs } from './components/Tabs';
export { Ease2eventToaster, notify } from './components/Toast';

// Default exports (for named convenience)
export { default as Ease2eventButton } from './components/Button';
export { default as Ease2eventCard } from './components/Card';
export { default as Ease2eventInput } from './components/Input';
export { default as Ease2eventBadge } from './components/Badge';
export { default as Ease2eventAvatar } from './components/Avatar';
export { default as Ease2eventSpinner } from './components/Spinner';
export { default as Ease2eventSkeleton } from './components/Skeleton';
