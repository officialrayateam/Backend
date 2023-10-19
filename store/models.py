from django.db import models
from accounts.models import Users


class Product(models.Model):
    category = models.ForeignKey(
        "Category", on_delete=models.CASCADE, verbose_name="دسته بندی", null=True, blank=True)
    name = models.CharField(max_length=99, verbose_name="نام محصول")
    image = models.ImageField(verbose_name="عکس محصول", null=True, blank=True)
    description = models.TextField(
        verbose_name="توضیحات محصول", null=True, blank=True)
    stock = models.PositiveIntegerField(verbose_name="موجودی محصول", default=0)
    price = models.PositiveBigIntegerField(verbose_name="قیمت محصول")
    discount = models.PositiveBigIntegerField(
        null=True, blank=True, verbose_name="تخفیف محصول", default=0)
    special = models.BooleanField(verbose_name="ویژه")
    selled_count = models.IntegerField(verbose_name="تعداد فروش", default=0)

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصول ها"

    def __str__(self):
        return self.name


class Category(models.Model):
    parent = models.ForeignKey(
        "Category", on_delete=models.SET_NULL, verbose_name="گروه", null=True, blank=True)
    name = models.CharField(max_length=99, verbose_name="نام دسته بندی")
    image = models.ImageField(verbose_name="عکس دسته بندی")

    class Meta:
        verbose_name = "دسته بندی"
        verbose_name_plural = "دسته بندی ها"

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = (
        ("1", "سبد خرید"),
        ("2", "در انتظار پرداخت"),
        ("3", "در انتظار تایید"),
        ("4", "در حال ارسال"),
        ("5", "تحویل شد"),
        ("6", "انصراف داده شد"),
    )

    PAYMENT_CHOICES = (
        ("1", "پرداخت انلاین"),
        ("2", "پرداخت حضوری در فروشگاه"),
        ("3", "پرداخت حضوری در منزل"),
    )

    user = models.ForeignKey(
        Users, on_delete=models.CASCADE, verbose_name="کاربر")
    receiver_name = models.CharField(
        max_length=199, verbose_name="نام تحویل گیرنده")
    receiver_address = models.TextField(verbose_name="ادرس تحویل گیرنده")
    receiver_phone = models.CharField(
        max_length=11, verbose_name="شماره تحویل گیرنده")
    order_full_price = models.PositiveBigIntegerField(
        verbose_name="قیمت کل سفارش")
    order_date = models.DateField(auto_now=True, verbose_name="تاریخ سفارش")
    order_delivery_date = models.DateTimeField(
        verbose_name="تاریخ تحویل سفارش", null=True, blank=True)
    payment_method = models.CharField(
        max_length=1, choices=PAYMENT_CHOICES, verbose_name="روش پرداخت", null=True, blank=True)
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, verbose_name="وضعیت")

    def __str__(self) -> str:
        return f"{self.user.get_full_name()} خرید ({dict(self.STATUS_CHOICES)[self.status]})"

    def update_price(self):
        order_items = self.orderitem_set.all()
        sum_price = 0
        for i in order_items:
            sum_price += ((i.product.price - i.product.discount) *
                          i.product_count)
        self.order_full_price = sum_price
        self.save()

    def get_sum_discount(self):
        self.update_price()
        order_items = self.orderitem_set.all()
        answer = 0
        for i in order_items:
            if i.product.discount:
                answer += (i.product.discount * i.product_count)
        return answer

    @classmethod
    def get_basket(cls, user):
        basket = cls.objects.filter(user=user.id, status="1")
        if basket.exists():
            return basket.get()
        return None

    @classmethod
    def create_basket(cls, user):
        my_basket = cls(
            user=user,
            receiver_name=user.get_full_name(),
            receiver_address=user.address,
            receiver_phone=user.phone,
            order_full_price=0,
            status=1
        )
        my_basket.save()
        return my_basket

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارشات"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, verbose_name="سفارش")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, verbose_name="محصول")
    product_price = models.PositiveBigIntegerField(verbose_name="قیمت محصول")
    product_discount = models.PositiveBigIntegerField(
        verbose_name="تخفیف محصول", default=0)
    product_count = models.IntegerField(verbose_name="تعداد محصول")\


    def get_actual_price(self):
        if self.product.discount:
            return self.product.price - self.product.discount
        else:
            return self.product.price

    @classmethod
    def add(cls, order, product, count):
        prod = Product.objects.get(pk=product)
        data = cls.objects.filter(order=order, product__id=product)
        if data.exists():
            my_order_item = data.get()
            my_order_item.product_price = my_order_item.product.price
            my_order_item.product_discount = my_order_item.product.discount
            my_order_item.product_count = my_order_item.product_count + 1
            my_order_item.save()
            my_order_item.order.update_price()
            return True
        else:
            instance = cls(order=order, product_price=prod.price,
                           product_discount=prod.discount,
                           product=prod, product_count=count)
            instance.save()
            instance.order.update_price()
            return True

    @classmethod
    def remove(cls, order, product, count):
        data = cls.objects.filter(order=order, product__id=product)
        if data.exists():
            if my_order_item.product_count - count > 0:
                target_order = my_order_item.order
                my_order_item.delete()
                target_order.update_price()
                return True
            else:
                my_order_item = data.get()
                my_order_item.product_count -= count
                my_order_item.save()
                my_order_item.order.update_price()
                return True
        else:
            return False

    class Meta:
        verbose_name = "ایتم"
        verbose_name_plural = "ایتم ها"


class SearchHistory(models.Model):
    user = models.ForeignKey(
        Users, on_delete=models.CASCADE, verbose_name="کاربر")
    text = models.CharField(max_length=199, verbose_name="جستجو")

    def __str__(self):
        return f"{self.user.get_full_name()} : {self.text}"

    class Meta:
        verbose_name = "تاریخچه جست و جو"
        verbose_name_plural = "تاریخچه ها"

    @classmethod
    def add_history(cls, user, text):
        user_serachs = cls.objects.filter(user=user)
        answer = None
        if len(user_serachs) >= 5:
            user_serachs[0].delete()
            answer = cls(user=user, text=text).save()
        else:
            answer = cls(user=user, text=text).save()
        return answer
