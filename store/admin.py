from django.contrib import admin
from django.http.request import HttpRequest
from store.models import Category, Order, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "get_price"]
    list_filter = ["special"]
    readonly_fields = ["selled_count"]

    def get_price(self, obj):
        return f"{obj.price} تومان"

    get_price.short_description = "قیمت محصول"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # def has_add_permission(self, request):
    #     return False
    pass
