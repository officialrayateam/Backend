from rest_framework.views import APIView
from rest_framework.response import Response
from store.models import Category, Product
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
