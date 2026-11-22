from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Recettes
class Recipe(models.Model):
    DISH_TYPES = [
        ('entree', 'Entrée'),
        ('plat', 'Plat'),
        ('dessert', 'Dessert'),
    ]

    name = models.CharField(max_length=200)

    image = models.ImageField(
        upload_to='recipes/',
        blank=True,
        null=True
    )

    dish_type = models.CharField(
        max_length=20,
        choices=DISH_TYPES
    )

    preparation_time = models.PositiveIntegerField()
    calories = models.PositiveIntegerField(default=0)
    instructions = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recipes'
    )

    diets = models.ManyToManyField(
        'Diet',
        blank=True,
        related_name='recipes'
    )

    allergens = models.ManyToManyField(
        'Allergen',
        blank=True,
        related_name='recipes'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return self.name


# Ingrédients
class Ingredient(models.Model):
    CATEGORIES = [
        ('cereales', 'Céréales'),
        ('fruits', 'Fruits'),
        ('legumes', 'Légumes'),
        ('legumineuses', 'Légumineuses'),
        ('epicerie', 'Épicerie'),
        ('poisson', 'Poisson'),
        ('fromage', 'Fromage'),
        ('produits_laitiers', 'Produits laitiers'),
        ('autre', 'Autre'),
    ]

    name = models.CharField(max_length=150, unique=True)

    category = models.CharField(
        max_length=30,
        choices=CATEGORIES,
        default='autre'
    )

    def str(self):
        return self.name


# Ingrédients utilisés dans les recettes
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='recipe_ingredients'
    )

    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.PROTECT,
        related_name='recipe_ingredients'
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    unit = models.CharField(max_length=30)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['recipe', 'ingredient'],
                name='unique_ingredient_per_recipe'
            )
        ]

    def str(self):
        return f'{self.ingredient.name} - {self.recipe.name}'


# Régimes alimentaires
class Diet(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def str(self):
        return self.name


# Allergènes
class Allergen(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def str(self):
        return self.name


# Recettes favorites
class FavoriteRecipe(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorite_recipes'
    )

    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='favorites'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'recipe'],
                name='unique_favorite_per_user'
            )
        ]

    def str(self):
        return f'{self.user} - {self.recipe.name}'


# Évaluations et commentaires des recettes
class RecipeReview(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recipe_reviews'
    )

    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'recipe'],
                name='unique_review_per_user'
            )
        ]

    def str(self):
        return f'{self.user} - {self.recipe.name}'


# Stock des ingrédients de chaque utilisateur
class UserIngredientStock(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ingredient_stocks'
    )

    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.PROTECT,
        related_name='user_stocks'
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )

    unit = models.CharField(max_length=30)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'ingredient'],
                name='unique_stock_per_user_ingredient'
            )
        ]

    def str(self):
        return f'{self.user} - {self.ingredient.name}'


# Planning hebdomadaire
class WeeklyPlan(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='weekly_plans'
    )

    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'start_date'],
                name='unique_weekly_plan_per_user'
            )
        ]

    def str(self):
        return f'{self.user} - {self.start_date}'


# Repas planifiés
class PlannedMeal(models.Model):
    MEAL_TYPES = [
        ('dejeuner', 'Déjeuner'),
        ('diner', 'Dîner'),
    ]

    weekly_plan = models.ForeignKey(
        WeeklyPlan,
        on_delete=models.CASCADE,
        related_name='planned_meals'
    )

    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='planned_meals'
    )

    date = models.DateField()

    meal_type = models.CharField(
        max_length=20,
        choices=MEAL_TYPES
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['weekly_plan', 'date', 'meal_type'],
                name='unique_meal_slot_per_day'
            )
        ]

    def str(self):
        return f'{self.date} - {self.get_meal_type_display()}'


# Liste des courses
class ShoppingList(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shopping_lists'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f'Liste de courses - {self.user}'


# Articles de la liste des courses
class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(
        ShoppingList,
        on_delete=models.CASCADE,
        related_name='items'
    )

    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='shopping_items'
    )

    custom_name = models.CharField(
        max_length=150,
        blank=True
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1,
        validators=[MinValueValidator(0)]
    )

    unit = models.CharField(max_length=30, blank=True)
    is_checked = models.BooleanField(default=False)

    def str(self):
        return self.custom_name or (
            self.ingredient.name if self.ingredient else 'Article')