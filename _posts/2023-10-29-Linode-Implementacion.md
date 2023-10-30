---
title: "Implementación de un E-commerce de alta disponiblidad con Amazon AWS"
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

Para llevar a cabo este despliegue, se empleará PrestaShop, una plataforma de comercio electrónico en su versión 8.1.1. Dicha plataforma se alojará en una instancia computacional Linodes, configurada con Debian 11, que actuará como servidor web utilizando NginX y PHP 7.4, y un Node Balancer. Además, se utilizará MariaDB como el motor de base de datos y un HaProxy para el cluster Galera de la base de datos.

Entre otros requisitos para llevar a cabo este proyecto, se incluyen la necesidad de poseer un dominio y un certificado SSL para garantizar la seguridad de dicho dominio.

## Linodes

## Balanceador de carga