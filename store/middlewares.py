from store.models import Order


class BasketMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        basket = Order.get_basket(request.user)
        if basket:
            request.length = len(basket.orderitem_set.all())
        else:
            request.length = 0
        response = self.get_response(request)
        return response
