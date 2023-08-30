from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=99, verbose_name="نام محصول")
    image = models.ImageField(verbose_name="عکس محصول")
    description = models.TextField(verbose_name="توضیحات محصول")
    stock = models.PositiveIntegerField(verbose_name="موجودی محصول")
    price = models.PositiveBigIntegerField(verbose_name="قیمت محصول")
    discount = models.PositiveBigIntegerField(
        null=True, blank=True, verbose_name="تخفیف محصول")
    special = models.BooleanField(verbose_name="ویژه")
    selled_count = models.IntegerField(verbose_name="تعداد فروش")

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصول ها"

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=99, verbose_name="نام دسته بندی")
    image = models.ImageField(verbose_name="عکس دسته بندی")

    class Meta:
        verbose_name = "دسته بندی"
        verbose_name_plural = "دسته بندی ها"


class Order(models.Model):
    STATUS_CHOICES = (
        ("1", "سبد خرید"),
        ("2", "در انتظار پرداخت"),
        ("3", "در انتظار تایید"),
        ("4", "در حال ارسال"),
        ("5", "تحویل شد"),
        ("6", "انصراف داده شد"),
    )

    receiver_name = models.CharField(
        max_length=199, verbose_name="نام تحویل گیرنده")
    receiver_address = models.TextField(verbose_name="ادرس تحویل گیرنده")
    receiver_phone = models.CharField(
        max_length=11, verbose_name="شماره تحویل گیرنده")
    order_full_price = models.PositiveBigIntegerField(
        verbose_name="قیمت کل سفارش")
    order_date = models.DateField(auto_now=True, verbose_name="تاریخ سفارش")
    order_delivery_date = models.DateTimeField(
        verbose_name="تاریخ تحویل سفارش")
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, verbose_name="وضعیت")

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارشات"
