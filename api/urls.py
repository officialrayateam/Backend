from django.urls import path
from api.views import Categories, MostSell, Products, Specials

urlpatterns = [
    path('most_sell/', MostSell.as_view(), name='most_sell'),
    path('specials/', Specials.as_view(), name='specials'),
    path('categories/', Categories.as_view(), name='categories'),
    path('products/', Products.as_view(), name='products'),
]
