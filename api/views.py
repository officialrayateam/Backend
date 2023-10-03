from rest_framework.views import APIView
from rest_framework.response import Response
from store.models import Category, Order, OrderItem, Product
from api.serializers import CategorySerializer, ProductSerializer


class MostSell(APIView):
    def get(self, request):
        products = Product.objects.all().order_by('-selled_count')
        answer = ProductSerializer(products, many=True)
        return Response(answer.data)


class Specials(APIView):
    def get(self, request):
        products = Product.objects.filter(special=True)
        answer = ProductSerializer(products, many=True)
        return Response(answer.data)


class Categories(APIView):
    def get(self, request):
        categoreis = Category.objects.all()
        answer = CategorySerializer(categoreis, many=True)
        return Response(answer.data)


class Products(APIView):
    def get(self, request):
        category = request.GET.get("category", 0)
        name = request.GET.get("name", "")
        products = Product.objects.all()
        if category:
            products = products.filter(category__id=category)
        if name:
            products = products.filter(name__contains=name)
        answer = ProductSerializer(products, many=True)
        return Response(answer.data)


class BasketAddView(APIView):
    def get(self, request):
        count = request.GET.get("count", 0)
        product = request.GET.get("product", 0)
        my_order = Order.objects.filter(user=request.user, status="1")
        if my_order.exists():
            my_order = my_order.get()
            OrderItem.add(my_order, product, count)
        else:
            basket = Order.create_basket(request.user)
            OrderItem.add(basket, product, count)


class BasketRemoveView(APIView):
    def get(self, request):
        count = request.GET.get("count", 0)
        product = request.GET.get("product", 0)
        my_order = Order.objects.filter(user=request.user, status="1")
        if my_order.exists():
            my_order = my_order.get()
            OrderItem.remove(my_order, product, count)
        else:
            basket = Order.create_basket(request.user)
            OrderItem.remove(basket, product, count)
