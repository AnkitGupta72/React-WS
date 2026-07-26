import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faSuitcaseRolling,
  faTasks,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { LIST_META, type ListKind } from '../types';
import './HomePage.css';

const CARD_ICONS: Record<ListKind, IconDefinition> = {
  todo: faTasks,
  travel: faSuitcaseRolling,
  shopping: faShoppingCart,
};

const CARD_BLURBS: Record<ListKind, string> = {
  todo: 'Add, edit, remove, and mark tasks complete. Let us help make life simpler.',
  travel:
    'Love to travel but forget to pack a thing or two? Keep packing and destination lists here.',
  shopping: 'Make a list and never forget an item when shopping.',
};

export function HomePage() {
  const [showHead2, setShowHead2] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowHead2(true), 2000);
    const t2 = window.setTimeout(() => setShowCards(true), 3500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div>
      <div className="text-center pt-2">
        <h1 className="myWriting">Tired of remembering so much stuff to do.</h1>
        {showHead2 && (
          <h1 className="myWriting2">Let us help you with that.</h1>
        )}
      </div>
      {showCards && (
        <div className="text-center pt-5 myCards">
          <Container>
            <Row>
              {(Object.keys(LIST_META) as ListKind[]).map((kind) => (
                <Col key={kind} md className="mb-3">
                  <Card
                    as={Link}
                    to={LIST_META[kind].path}
                    className="myCard text-decoration-none text-dark h-100"
                  >
                    <Card.Body>
                      <Card.Title>
                        <FontAwesomeIcon icon={CARD_ICONS[kind]} size="lg" />
                        &nbsp;{LIST_META[kind].title}
                      </Card.Title>
                      <Card.Subtitle className="mt-3 mb-2 text-muted">
                        {LIST_META[kind].description}
                      </Card.Subtitle>
                      <Card.Text className="mt-3">{CARD_BLURBS[kind]}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
}
