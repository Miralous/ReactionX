---
title: '使用命令行安装单系统 Arch Linux'
description: '论加入 Arch 教的第一步——安装。'
pubDate: 2024-02-25
author: 'Silvaire'
tags: ['Arch', 'Linux', 'Terminal']
recommend: true
heroImage: none
ogImage: none
heroImageAspectRatio: '16/9'
---

## 检查

1. 你的电脑支持 UEFI 启动。
2. 你的电脑已经关闭安全启动。
3. 你拥有 Linux 基础。
4. 好的心态 😉

> [!NOTE]
> 如果您在安装过程中遇到问题，请尝试使用搜索引擎搜索问题或者查阅 [Arch Wiki](https://wiki.archlinux.org)，最好不要询问他人。

> [!WARNING]
> 您硬盘上的所有信息将会被抹除，所以请提前备份，如出现数据丢失等情况，后果自负。

## 准备

1. 一个 [Arch Linux 镜像](https://mirrors.tuna.tsinghua.edu.cn/archlinux/iso/latest/archlinux-x86_64.iso)。
2. 使用写盘工具将镜像文件写入你的 USB。
   <br>

准备好后，请从 USB 中启动您的 Arch Linux ISO。进入 Grub 引导界面选择后请第一个。

## 连网

> 这一步仅限使用 WLAN 连接网络的设备需要操作。如果你已经使用网线连接了网络，请跳过这一步。

我们可以使用 `iwctl` 命令连接网络。

```bash
iwctl
device list # 查看你的无线网卡名称
station wlan0 scan # 扫描网络，一般无线网卡为 wlan0
station wlan0 get-networks # 列出 Wi-Fi 列表
station wlan0 connect 你的网络名 # 连接网络
exit # 退出
```

然后，你需要测试是否已经连接网络。

```bash
ping 1.1.1.1
```

## 换源

在此之前，请先禁用 Reflector。

```bash
systemctl stop reflector.service
```

删掉 mirrorlist 文件。

```bash
sudo rm -rf /etc/pacman.d/mirrorlist
```

然后就可以更换了。

```bash
vim /etc/pacman.d/mirrorlist
```

请在此加入以下内容：

```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

完成后请按下 ESC 并输入 `:wq`，回车。

## 分区

在分区之前，你需要查看你磁盘的编号。

```bash
fdisk -l
```

你会看到一个或者多个 Disk /dev/* 等磁盘，请查看磁盘的分区或磁盘大小来辨别你要安装的磁盘。

```bash
cfdisk /dev/你的磁盘
```

1. 删除所有分区。
2. 选中 Free Space，Create，分区大小 `1G`，Type 选择 EFI System。
3. 继续把光标放在 Free Space 上，直接回车，然后选择 Write，输入 `y`。

## 创建文件系统

```bash
mkfs.fat -F32 /dev/(EFI分区)
mkfs.btrfs -L ArchLinux /dev/(系统分区)
mount /dev/(系统分区) /mnt
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
umount /mnt
mount -t btrfs -o subvol=/@,compress=zstd /dev/sdxn /mnt
mount -t btrfs -o subvol=/@home,compress=zstd /dev/sdxn /mnt/home --mkdir
mount /dev/(EFI分区) /mnt/boot --mkdir
```

## 安装基本系统

```bash
pacman -Sy archlinux-keyring
pacstrap /mnt base base-devel linux linux-firmware btrfs-progs networkmanager vim nano sudo iwd net-tools
genfstab -U /mnt > /mnt/etc/fstab
grep "subvolid" /mnt/etc/fstab
```

如果有 subvolid 输出，请用 vim 编辑 fstab 删除。

## 配置

```bash
mkdir -p /mnt/etc/pacman.d
cp -r /etc/pacman.d/mirrorlist /mnt/etc/pacman.d
arch-chroot /mnt
```

### 主机名称

```bash
echo "Silver" > /etc/hostname
```

### Hosts

编辑 /etc/hosts 加入：

```
127.0.0.1   localhost
::1         localhost
127.0.1.1   archlinux.localdomain archlinux
```

### 语言支持

编辑 /etc/locale.gen，取消注释 `zh_CN.GBK`、`zh_CN.UTF-8`、`en_US.UTF-8`。

```bash
locale-gen
echo 'LANG=en_US.UTF-8' > /etc/locale.conf
```

### 时区

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
```

### Root 密码

```bash
passwd root
```

### 安装 Plasma 桌面（可选）

```bash
pacman -S adobe-source-han-sans-cn-fonts plasma konsole dolphin xorg ark neofetch sddm
```

### 开机启动

```bash
systemctl enable sddm
systemctl enable NetworkManager
```

### 添加用户

```bash
useradd -m -G wheel -s /bin/bash 你的用户名
passwd 你的用户名
```

编辑 /etc/sudoers，取消注释 `%wheel ALL=(ALL:ALL) ALL`。

### 配置引导

```bash
pacman -S grub efibootmgr os-prober
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH
grub-mkconfig -o /boot/grub/grub.cfg
```

### 最后一步

```bash
exit
reboot
```

## 大功告成

恭喜你，成功的安装了 Arch Linux。