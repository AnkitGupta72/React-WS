import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Card } from 'react-bootstrap';
import type { User } from '../types';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card body className="border-0 shadow-none py-1">
      <div className="d-flex justify-content-between align-items-center">
        <Card.Title as="span" className="mb-0 fs-6">
          {user.name}
        </Card.Title>
        <FontAwesomeIcon icon={faUser} size="lg" />
      </div>
    </Card>
  );
}
