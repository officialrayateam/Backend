from django.contrib import admin
from store.models import Category, Order, OrderItem, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "get_price"]
    list_filter = ["special"]
    readonly_fields = ["selled_count"]
    search_fields = ["name", "description"]
    autocomplete_fields = ["category"]

    def get_price(self, obj):
        return f"{obj.price} تومان"

    get_price.short_description = "قیمت محصول"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ["name"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    search_fields = ["receiver_name"]
    # def has_add_permission(self, request):
    #     return False
    pass


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    pass
