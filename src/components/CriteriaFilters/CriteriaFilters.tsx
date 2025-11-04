import { Form, Row, Col } from "react-bootstrap";

type Props = {
  query: string;
  setQuery: (v: string) => void;
};

const CriteriaFilters: React.FC<Props> = ({ query, setQuery }) => {
  return (
    <Form className="mb-4">
      <Row className="align-items-center g-2">
        <Col md={8} lg={6}>
          <Form.Control
            type="text"
            placeholder="Поиск по названию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CriteriaFilters;