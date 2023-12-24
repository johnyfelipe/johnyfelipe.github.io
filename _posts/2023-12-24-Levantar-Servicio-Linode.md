---
title: "Levantar el servicio WEB y de Base de datos"
categories:
  - Terminal
tags:
  - SSH
---

# Servidores WEB

~~~ bash
sudo hostnamectl set-hostname web1
sudo nano /etc/hosts
	127.0.1.1 web1
~~~

~~~bash
sudo hostnamectl set-hostname web2
sudo nano /etc/hosts
	127.0.1.1 web2
~~~

~~~ bash
sudo hostnamectl set-hostname web3
sudo nano /etc/hosts
  127.0.1.1 web3
~~~

# Balanceador de carga

Agregar las nuevas IPs al node balancer

# Clúster de Galera 

Código global: bd1, bd2, bd3

~~~ bash
mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
~~~

## BD1

~~~ bash
sudo hostnamectl set-hostname bd1
sudo nano /etc/hosts
	127.0.1.1 bd1
~~~

~~~ bash
sudo nano /etc/mysql/mariadb.conf.d/galera.cnf
~~~

~~~ vim
wsrep_cluster_address="gcomm://"

wsrep_node_address="IP-bd1" # IP de la instancia que se esta configurando
~~~

En el cluster principal unicamente después de configurar todos los clúster

~~~ bash
sudo galera_new_cluster
~~~

Comprobar el servicio de clúster

~~~ bash
mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
~~~

## BD2

~~~ bash
sudo hostnamectl set-hostname bd2
sudo nano /etc/hosts
	127.0.1.1 bd2
~~~

~~~ bash
sudo nano /etc/mysql/mariadb.conf.d/galera.cnf
~~~

~~~ vim
wsrep_cluster_address="gcomm://IP-bd1,IP-bd2,IP-bd3"

wsrep_node_address="IP-bd2" # IP de la instancia que se esta configurando
~~~

Comprobar el servicio de clúster

~~~ bash
mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
~~~

## BD3

~~~ bash
sudo hostnamectl set-hostname bd3
sudo nano /etc/hosts
  127.0.1.1 bd3
~~~

~~~ bash
sudo nano /etc/mysql/mariadb.conf.d/galera.cnf
~~~

~~~ vim
wsrep_cluster_address="gcomm://IP-bd1,IP-bd2,IP-bd3"

wsrep_node_address="IP-bd3" # IP de la instancia que se esta configurando
~~~

Comprobar el servicio de clúster

~~~ bash
mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
~~~

## En caso de que el servicio de MariaDB no inicie

### Solucion 1

~~~ bash
sudo nano /var/lib/mysql/grastate.dat
~~~

En caso que exista otro valor cambiarlo a 1

~~~ vim
safe_to_bootstrap: 1
~~~

~~~ bash
sudo galera_new_cluster
~~~

Reiniciamos mariadb en los otros clusters

~~~ bash
sudo systemctl restart mariadb
~~~

### Solucion 2

~~~ bash
sudo nano /var/lib/mysql/grastate.dat
~~~

~~~ vim
safe_to_bootstrap: 1
~~~

detener todos los servicios

~~~ bash
sudo killall -KILL mysql mysqld_safe mysqld mysql-systemd
~~~

~~~ bash
sudo galera_new_cluster
~~~

~~~ bash
sudo systemctl restart mariadb
~~~

# HaProxy

~~~ bash
ss -tunelp | grep 3306
~~~

Modificar los nodos con las IPs de los nuevos servidores de BD

~~~ bash
sudo nano /etc/haproxy/haproxy.cfg
~~~

~~~ vim              
server n-bd1 IP-bd1:3306 check weight 1
server n-bd2 IP-bd2:3306 check weight 1
server n-bd3 IP-bd3:3306 check weight 1
~~~