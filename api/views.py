from rest_framework.views import APIView
from rest_framework.response import Response
from store.models import Category, Order, OrderItem, Product
from api.serializers import CategorySerializer, ProductSerializer, SearchHistorySerializer
from accounts.permissions import IsUser
from store.models import SearchHistory


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
        done = request.GET.get("done", "")
        products = Product.objects.all()
        if category:
            products = products.filter(category__id=category)
        if name:
            products = products.filter(name__contains=name)
            if done:
                if request.user.is_authenticated:
                    SearchHistory.add_history(request.user, name)
                else:
                    pass
        answer = ProductSerializer(products, many=True)
        return Response(answer.data)


class BasketAddView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        count = request.GET.get("count", 0)
        product = request.GET.get("product", 0)
        my_order = Order.objects.filter(user__id=request.user.id, status="1")
        if request.user.is_authenticated:
            if my_order.exists():
                my_order = my_order.get()
                OrderItem.add(my_order, product, count)
            else:
                basket = Order.create_basket(request.user)
                OrderItem.add(basket, product, count)
            return Response({"done": True, "length": len(my_order.orderitem_set.all())})
        else:
            return Response({"done": False})


class BasketRemoveView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        count = int(request.GET.get("count", 0))
        product = request.GET.get("product", 0)
        my_order = Order.objects.filter(user=request.user, status="1")
        if request.user.is_authenticated:
            basket = None
            if my_order.exists():
                basket = my_order.get()
                OrderItem.remove(basket, product, count)
            else:
                basket = Order.create_basket(request.user)
                OrderItem.remove(basket, product, count)
            return Response({"done": True, "length": len(my_order.orderitem_set.all())})
        else:
            return Response({"done": False})


class HistoryView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            user_serachs = SearchHistory.objects.filter(user=request.user.id)
            answer = SearchHistorySerializer(user_serachs, many=True)
            return Response(answer.data)
        else:
            return Response({"done": False})
