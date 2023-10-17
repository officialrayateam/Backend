from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login
from accounts.models import Users
import os
from store.models import Order
from rest_framework.authtoken.models import Token


class HomeView(View):
    def get(self, request):
        file_names = os.listdir("media/sliders")
        response = render(request, "index.html", {"files": file_names})
        if request.user.is_authenticated and not request.COOKIES.get("token", None):
            token, _ = Token.objects.get_or_create(user=request.user)
            response.set_cookie(key="token", value=token)
        return response


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
            login(request, user)
            return redirect("/")
        else:
            return render(request, "LoginRegister.html", {"special_error": "فک کردی میتونی کاری کنی ؟"})


class CartView(View):
    def get(self, request):
        if request.user.is_authenticated:
            basket = Order.get_basket(request.user)
            if basket:
                sum_discount = basket.get_sum_discount()
                price_to_pay = basket.order_full_price - sum_discount
                order_items = basket.orderitem_set.all()
                return render(request, "cart.html", {"basket": basket, "items": order_items, "sum_discount": sum_discount, "full_price": basket.order_full_price, "price_to_pay": price_to_pay})
            else:
                return render(request, "cart.html", {"basket": None, "items": None, "sum_discount": 0, "full_price": 0, "price_to_pay": 0})
        else:
            return redirect("login")


class CheckoutView(View):
    def get(self, request):
        if request.user.is_authenticated:
            basket = Order.get_basket(request.user)
            address = request.user.address
            phone = request.user.phone
            name = request.user.get_full_name()
            if basket:
                sum_discount = basket.get_sum_discount()
                price_to_pay = basket.order_full_price - sum_discount
                order_items = basket.orderitem_set.all()
                return render(request, "checkout.html", {"basket": basket, "items": order_items, "sum_discount": sum_discount, "full_price": basket.order_full_price, "price_to_pay": price_to_pay, "name": name, "phone": phone, "address": address})
            else:
                return redirect("cart")
        else:
            return redirect("login")

    def post(self, request):
        payemnt_gateway = (request.POST["payment-gateway"])
        basket = Order.get_basket(request.user)
        if basket:
            basket.payment_method = payemnt_gateway
            basket.status = "2"
            basket.save()
            return redirect("cart")
        else:
            return redirect("cart")


class OrdersView(View):
    def get(self, request):
        return render(request, "MyOrders.html")


class ProductsView(View):
    def get(self, request):
        return render(request, "products.html")


class ProfileView(View):
    def get(self, request):
        return render(request, "profile.html")
