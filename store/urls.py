from django.urls import path
from store import views

urlpatterns = [
    path('', views.HomeView.as_view(), name="home"),
    path('login/', views.LoginRegisterView.as_view(), name="login"),
    path('cart/', views.CartView.as_view(), name="cart"),
    path('checkout/', views.CheckoutView.as_view(), name="checkout"),
    path('orders/', views.OrdersView.as_view(), name="orders"),
    path('products/', views.ProductsView.as_view(), name="product"),
    path('profile/', views.ProfileView.as_view(), name="profile"),
]
