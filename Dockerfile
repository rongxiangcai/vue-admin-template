FROM nginx:1.14.2

MAINTAINER wkmtem <wkmtem@nsntc.com>

COPY ./dist /var/www/html
#COPY nginx.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 80
CMD ["nginx","-g","daemon off;"]