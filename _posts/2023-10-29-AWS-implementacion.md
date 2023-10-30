---
title: "Implementación de un E-commerce de alta disponiblidad con AWS"
categories:
  - Cloud Computing
tags:
  - Nube pública
  - EC2
  - SSH
  - Load Balancer
  - Firewall
  - Security groups
  - VPC
---

Un e-commerce de alta disponibilidad es una tienda online que está diseñada para estar disponible el 99,99% del tiempo. Esto significa que los clientes pueden acceder a la tienda y realizar compras sin problemas, incluso durante períodos de alto tráfico o cuando se producen fallos en el sistema.

Para llevar a cabo este despliegue, se empleará PrestaShop, una plataforma de comercio electrónico en su versión 8.1.1. Dicha plataforma se alojará en una instancia computacional EC2, configurada con Ubuntu 22.04, que actuará como servidor web utilizando NginX y PHP 7.4. Además, se utilizará RDS con MariaDB como el motor de base de datos.

Entre otros requisitos para llevar a cabo este proyecto, se incluyen la necesidad de poseer un dominio y un certificado SSL para garantizar la seguridad de dicho dominio.

# Crear cuenta en Amazon AWS


# IAM

## Crear usuario como administrador

