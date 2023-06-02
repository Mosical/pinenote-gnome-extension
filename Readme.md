# Pinenote Gnome Extension

This is a very very hacky Gnome extension to interface with some of the
rockchip_ebc kernel driver options. It also provides a "rotate" menu option to
easily switch between landscape and portrait mode (which is handy when
switching between desktop work and ebook reading).

**This is more a proof of concept as I never before worked with GJS. Use with
care. Suggestions are welcome!**

**Naturally, merge requests (or rewrites) are very welcome!**

![screenshot](screenshot.png)

## Installation

* Copy to the local extension directory

	rsync -avh pnhelper@m-weigand.github.com/ $HOME/.local/share/gnome-shell/extensions/pnhelper@m-weigand.github.com/

* enable in gnome extension manager
* restart gnome

## Debian packaging

	mkdir build
	git clone https://github.com/PNDeb/pinenote-gnome-extension.git
	cd pinenote-gnome-extension
	dpkg-buildpackage -us -uc

## Testing under wayland

	./install.sh && dbus-run-session -- gnome-shell --nested --wayland


## TODO

* Make sure the disable() function properly destroys all objects
