import { Form, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { selectQuery, setQuery } from "../../store/slices/filterSlice";

/**
 * Компонент фильтров для страницы критериев
 * 
 * Использует Redux для управления состоянием поискового запроса.
 * При изменении значения в input, состояние обновляется в Redux store
 * через dispatch(setQuery(...)), что позволяет сохранять фильтр при
 * переключении страниц и при входе в PWA.
 */
const CriteriaFilters: React.FC = () => {
  // Получаем текущий поисковый запрос из Redux store
  const query = useSelector(selectQuery);
  
  // Получаем функцию dispatch для отправки actions в store
  const dispatch = useDispatch();

  /**
   * Обработчик изменения значения в поле поиска
   * Обновляет состояние в Redux store через action setQuery
   */
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  return (
    <Form className="criteria-filters mb-4">
      <Row className="criteria-filters__row align-items-center g-2">
        {/* На мобильных инпут тянется на 100% (xs), с md≥768px — 2 карточки в ряд, поэтому оставляем только 60-65% ширины */}
        <Col xs={12} md={8} lg={5}>
          <Form.Control
            className="criteria-filters__input"
            type="text"
            placeholder="Поиск по названию..."
            value={query}
            onChange={handleQueryChange}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default CriteriaFilters;