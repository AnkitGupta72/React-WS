import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
import { LIST_META, type ListKind, type TaskBucket } from '../types';
import './ListPage.css';

interface ListPageProps {
  kind: ListKind;
}

const emptyBucket = (): TaskBucket => ({ active: [], completed: [] });

export function ListPage({ kind }: ListPageProps) {
  const { selectedUser, loading: usersLoading } = useUser();
  const [bucket, setBucket] = useState<TaskBucket>(emptyBucket());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!selectedUser) {
      setBucket(emptyBucket());
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.fetchList(kind, selectedUser.id);
      setBucket(res.bucket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load list');
    } finally {
      setLoading(false);
    }
  }, [kind, selectedUser]);

  useEffect(() => {
    void load();
  }, [load]);

  async function persist(next: TaskBucket) {
    if (!selectedUser) return;
    setSaving(true);
    setError(null);
    try {
      const res = await api.saveList(kind, selectedUser.id, next);
      setBucket(res.bucket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function addItem() {
    const text = newText.trim();
    if (!text) return;
    const next: TaskBucket = {
      active: [...bucket.active, text],
      completed: [...bucket.completed],
    };
    setNewText('');
    setModalOpen(false);
    await persist(next);
  }

  async function markComplete(index: number) {
    const item = bucket.active[index];
    if (item === undefined) return;
    const next: TaskBucket = {
      active: bucket.active.filter((_, i) => i !== index),
      completed: [...bucket.completed, item],
    };
    await persist(next);
  }

  async function removeActive(index: number) {
    const next: TaskBucket = {
      active: bucket.active.filter((_, i) => i !== index),
      completed: [...bucket.completed],
    };
    await persist(next);
  }

  async function removeCompleted(index: number) {
    const next: TaskBucket = {
      active: [...bucket.active],
      completed: bucket.completed.filter((_, i) => i !== index),
    };
    await persist(next);
  }

  if (usersLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <Container className="py-5 text-center">
        <p>Select or create a user to manage your {LIST_META[kind].title}.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4" style={{ fontFamily: 'monospace' }}>
        {LIST_META[kind].title}
        <span className="fs-6 text-muted ms-2">for {selectedUser.name}</span>
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <Col md className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <h3 className="mb-0" style={{ fontFamily: 'monospace' }}>
                Active
              </h3>
              <Button
                variant="secondary"
                className="addButton"
                onClick={() => setModalOpen(true)}
                disabled={saving}
                aria-label="Add item"
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
            <ul className="list-unstyled">
              {bucket.active.map((item, index) => (
                <li
                  key={`active-${index}-${item}`}
                  className="mb-2 d-flex align-items-center gap-2"
                >
                  <span className="flex-grow-1">{item}</span>
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => void markComplete(index)}
                    disabled={saving}
                    aria-label="Mark complete"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => void removeActive(index)}
                    disabled={saving}
                    aria-label="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </li>
              ))}
              {bucket.active.length === 0 && (
                <li className="text-muted">No active items.</li>
              )}
            </ul>
          </Col>
          <Col md>
            <h3 style={{ fontFamily: 'monospace' }}>Completed</h3>
            <ul className="list-unstyled mt-3">
              {bucket.completed.map((item, index) => (
                <li
                  key={`done-${index}-${item}`}
                  className="mb-2 d-flex align-items-center gap-2"
                >
                  <span className="flex-grow-1 text-decoration-line-through text-muted">
                    {item}
                  </span>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => void removeCompleted(index)}
                    disabled={saving}
                    aria-label="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </li>
              ))}
              {bucket.completed.length === 0 && (
                <li className="text-muted">No completed items.</li>
              )}
            </ul>
          </Col>
        </Row>
      )}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="What should I remember?"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void addItem();
              }
            }}
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => void addItem()}
            disabled={saving}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
