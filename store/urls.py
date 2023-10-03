from django.urls import path
from store import views

urlpatterns = [
    path('', views.HomeView.as_view()),
    path('login/', views.LoginRegisterView.as_view()),
    path('cart/', views.CartView.as_view()),
    path('checkout/', views.CheckoutView.as_view()),
    path('orders/', views.OrdersView.as_view()),
    path('products/', views.ProductsView.as_view()),
    path('profile/', views.ProfileView.as_view()),
]
