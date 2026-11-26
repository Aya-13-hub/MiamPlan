import React from "react";
import Ingredients from "./Ingredients/Ingredients";

export default function PreviewIngredients({ onNavigate, onLogout } = {}) {
  return <Ingredients onNavigate={onNavigate} onLogout={onLogout} />;
}