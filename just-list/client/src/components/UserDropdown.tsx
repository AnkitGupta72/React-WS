import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  Dropdown,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { UserCard } from './UserCard';

export function UserDropdown() {
  const { users, selectedUser, selectUser, createUser } = useUser();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter a name first.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createUser(trimmed);
      setName('');
      setAdding(false);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create user');
    } finally {
      setBusy(false);
    }
  }

  function onNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleAdd();
    }
  }

  return (
    <Dropdown show={open} onToggle={(next) => setOpen(next)}>
      <Dropdown.Toggle variant="outline-secondary" id="user-dropdown">
        {selectedUser ? selectedUser.name : (
          <>
            <FontAwesomeIcon icon={faPlus} /> Add User
          </>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu
        align="end"
        style={{ minWidth: '13rem', maxHeight: '20rem', overflowY: 'auto' }}
      >
        {users.map((user) => (
          <Dropdown.Item
            key={user.id}
            onClick={() => {
              selectUser(user);
              setOpen(false);
            }}
          >
            <UserCard user={user} />
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.ItemText>
          {!adding ? (
            <Card
              role="button"
              tabIndex={0}
              className="text-center"
              onClick={() => setAdding(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setAdding(true);
              }}
            >
              <Card.Body className="py-2">
                <FontAwesomeIcon icon={faPlus} size="lg" />
              </Card.Body>
            </Card>
          ) : (
            <Form onSubmit={(e) => void handleAdd(e)}>
              <InputGroup size="sm">
                <Form.Control
                  autoFocus
                  name="userName"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={onNameKeyDown}
                  disabled={busy}
                />
                <Button type="submit" variant="outline-primary" disabled={busy}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </InputGroup>
              {error && <div className="text-danger small mt-1">{error}</div>}
            </Form>
          )}
        </Dropdown.ItemText>
      </Dropdown.Menu>
    </Dropdown>
  );
}
