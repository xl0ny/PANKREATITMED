import React, { useState, useEffect } from "react";
import { getDraftOrderId } from "../../api/draft.order";
import "./CartButton.css";

/**
 * Cart button fixed to bottom-left of the page.
 * Shows number of items in cart.
 * Updates automatically and on click.
 */
const CartButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getDraftOrderId({ auth: true });
      console.log("✅ [getOrderID] Raw backend response:", response);
      setItemCount(response.criteria_amount);
    } catch (e: any) {
      console.error(e);
      window.alert(`Ошибка получения данных корзины: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные корзины при монтировании
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <button
      className={`cart-button ${itemCount === 0 ? 'cart-button--empty' : ''}`}
      onClick={() => itemCount > 0 && fetchCart()}
      disabled={itemCount === 0}
      aria-label={`Корзина${itemCount === 0 ? ' (пуста)' : ''}`}
      title={itemCount === 0 ? 'Корзина пуста' : 'Открыть корзину'}
      type="button"
    >
      {/* Inline SVG cart icon (fallback if you want to use your own image, replace with an <img/> pointing to your asset) */}
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
      {/* Optionally show small badge with short id */}
      {itemCount > 0 && (
        <span className="cart-button__badge">{itemCount}</span>
      )}
    </button>
  );
};

export default CartButton;
