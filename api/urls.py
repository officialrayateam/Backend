from django.urls import path
from api.views import Categories, MostSell, Products, Specials, BasketAddView, BasketRemoveView

urlpatterns = [
    path('most_sell/', MostSell.as_view(), name='most_sell'),
    path('specials/', Specials.as_view(), name='specials'),
    path('categories/', Categories.as_view(), name='categories'),
    path('products/', Products.as_view(), name='products'),
    path('basket/add/', BasketAddView.as_view(), name='basket_add'),
    path('basket/remove/', BasketRemoveView.as_view(), name='basket_remove'),
]
