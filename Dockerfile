FROM    node AS builder
RUN     mkdir /kakao-map
WORKDIR /kakao-map
COPY    . .
RUN     npm install
RUN     npm run build



FROM    nginx AS runtime
COPY    --from=builder /kakao-map/build/ /usr/share/nginx/html
RUN     rm /etc/nginx/conf.d/default.conf
COPY    --from=builder /kakao-map/nginx.conf /etc/nginx/conf.d
CMD     [ "nginx", "-g","daemon off;" ]