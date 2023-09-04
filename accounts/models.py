from django.db import models
from django.contrib.auth.models import AbstractUser


class Users(AbstractUser):
    phone = models.CharField(verbose_name="شماره تلفن", max_length=11)
    address = models.TextField(verbose_name="آدرس")

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربر ها"
