from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login
from accounts.models import Users
import os
from store.models import Order


class HomeView(View):
    def get(self, request):
        file_names = os.listdir("media/sliders")
        return render(request, "index.html", {"files": file_names})


class LoginRegisterView(View):
    def get(self, request):
        return render(request, "LoginRegister.html")

    def post(self, request):
        username = request.POST.get("user")
        password1 = request.POST.get("password")
        password2 = request.POST.get("repeat-password")
        model = request.POST.get("model")
        if model == "login":
            user = authenticate(username=username, password=password1)
            if user is not None:
                login(request, user)
                return redirect("/")
            else:
                return render(request, "LoginRegister.html", {"error": "اشکالی در ورود پیش آمد.", "model": "login"})
        elif model == "register":
            if not password1 == password2:
                return render(request, "LoginRegister.html", {"error": "پسورد ها یکی نیستند.", "model": "register"})
            user = Users.objects.create_user(
                username=username, password=password1)
            user.save()
            return redirect("/")
        else:
            return render(request, "LoginRegister.html", {"special_error": "فک کردی میتونی کاری کنی ؟"})


class CartView(View):
    def get(self, request):
        basket = Order.get_basket(request.user)
        order_items = basket.orderitem_set.all()
        if basket:
            return render(request, "cart.html", {"basket": basket, "items": order_items})
        else:
            return render(request, "cart.html", {"basket": None, "items": None})


class CheckoutView(View):
    def get(self, request):
        return render(request, "checkout.html")


class OrdersView(View):
    def get(self, request):
        return render(request, "MyOrders.html")


class ProductsView(View):
    def get(self, request):
        return render(request, "products.html")


class ProfileView(View):
    def get(self, request):
        return render(request, "profile.html")
