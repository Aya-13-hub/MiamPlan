from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):

    GENDER_CHOICES = [
        ('female', 'Femme'),
        ('male', 'Homme'),
        ('other', 'Autre'),
    ]

    full_name = models.CharField(max_length=150, default="")

    email = models.EmailField(unique=True)

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True
    )

    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )

    diet_preferences = models.ManyToManyField(
        'recipes.Diet',
        blank=True,
        related_name='users'
    )

    allergies = models.ManyToManyField(
        'recipes.Allergen',
        blank=True,
        related_name='users'
    )
class PasswordResetCode(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reset_codes",
    )
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    used = models.BooleanField(default=False)