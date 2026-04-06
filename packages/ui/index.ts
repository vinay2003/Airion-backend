/**
 * @airion/ui — Barrel Export
 *
 * Import components:
 *   import { Button, Card, Input, Badge, Avatar, Spinner } from '@airion/ui';
 *
 * Import styles (in your index.css):
 *   @import "@airion/ui/globals.css";
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
export { AirionToaster, notify } from './components/Toast';

// Default exports (for named convenience)
export { default as AirionButton } from './components/Button';
export { default as AirionCard } from './components/Card';
export { default as AirionInput } from './components/Input';
export { default as AirionBadge } from './components/Badge';
export { default as AirionAvatar } from './components/Avatar';
export { default as AirionSpinner } from './components/Spinner';
export { default as AirionSkeleton } from './components/Skeleton';
