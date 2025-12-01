import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartAsync, selectItemsCount, selectDraftOrderId, selectCartLoading } from "../../store/slices/cartSlice";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import "./CartButton.css";

/**
 * Cart button fixed to bottom-left of the page.
 * Shows number of items in cart.
 * Updates automatically and on click.
 * Navigates to order page when clicked.
 */
const CartButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemCount = useSelector(selectItemsCount);
  const draftOrderId = useSelector(selectDraftOrderId);
  const loading = useSelector(selectCartLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Загружаем данные корзины при монтировании и если авторизован
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartAsync() as any);
    }
  }, [dispatch, isAuthenticated]);

  const handleClick = () => {
    if (itemCount > 0 && draftOrderId) {
      navigate(`/orders/${draftOrderId}`);
    } else if (isAuthenticated) {
      // Обновляем данные корзины при клике
      dispatch(fetchCartAsync() as any);
    }
  };

  // Не показываем кнопку, если пользователь не авторизован
  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className={`cart-button ${itemCount === 0 ? 'cart-button--empty' : ''}`}
      onClick={handleClick}
      disabled={itemCount === 0}
      aria-label={`Корзина${itemCount === 0 ? ' (пуста)' : ''}`}
      title={itemCount === 0 ? 'Корзина пуста' : 'Открыть корзину'}
      type="button"
    >
      {/* Inline SVG cart icon */}
      <svg
        className="cart-button__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="20" r="1" />
        <circle cx="20" cy="20" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {loading && <span className="cart-button__loading">…</span>}
      {/* Badge with item count */}
      {itemCount > 0 && (
        <span className="cart-button__badge">{itemCount}</span>
      )}
    </button>
  );
};

export default CartButton;
