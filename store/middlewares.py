from store.models import Order


class BasketMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        basket = Order.get_basket(request.user)
        if basket:
            items = basket.orderitem_set.all()
            sum_product = 0
            for item in items:
                sum_product += item.product_count
            request.length = sum_product
        else:
            request.length = 0
        response = self.get_response(request)
        return response
