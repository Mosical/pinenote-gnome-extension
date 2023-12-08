// rockchip-ebc functions, mainly communicating with the dbus service for the
// Pinenote
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

// regenerate with
// dbus-send --system --print-reply --dest=org.pinenote.ebc /ebc org.freedesktop.DBus.Introspectable.Introspect
// make sure to fix the <node> tag and remove the "name"
const PinenoteDbusInterface = `
<node>
  <interface name="org.pinenote.ebc">
    <method name="GetAutorefresh">
      <arg name="state_autorefresh" type="b" direction="out"/>
    </method>
    <method name="GetBwMode">
      <arg name="current_mode" type="y" direction="out"/>
    </method>
    <method name="GetDclkSelect">
      <arg name="dclk_select" type="y" direction="out"/>
    </method>
    <method name="GetDefaultWaveform">
      <arg name="current_waveform" type="y" direction="out"/>
    </method>
    <method name="RequestQualityOrPerformanceMode">
      <arg name="mode_request" type="y" direction="in"/>
    </method>
    <method name="SetAutoRefresh">
      <arg name="state" type="b" direction="in"/>
    </method>
    <method name="SetBwMode">
      <arg name="new_mode" type="y" direction="in"/>
    </method>
    <method name="SetDclkSelect">
      <arg name="state" type="y" direction="in"/>
    </method>
    <method name="SetDefaultWaveform">
      <arg name="waveform" type="y" direction="in"/>
    </method>
    <method name="SetEBCParameters">
      <arg name="default_waveform" type="y" direction="in"/>
      <arg name="bw_mode" type="y" direction="in"/>
    </method>
    <method name="TriggerGlobalRefresh">
    </method>
    <signal name="BwModeChanged">
    </signal>
    <signal name="ReqQualityOrPerformance">
      <arg name="requested_mode" type="y"/>
    </signal>
    <signal name="WaveformChanged">
    </signal>
    <property name="default_waveform" type="y" access="readwrite"/>
  </interface>
</node>
`

const PinenoteDbusProxy = Gio.DBusProxy.makeProxyWrapper(PinenoteDbusInterface);

var PnProxy = new PinenoteDbusProxy(
    Gio.DBus.system,
    "org.pinenote.ebc",
    "/ebc",
);

function ebc_trigger_global_refresh(){
	PnProxy.TriggerGlobalRefreshSync();
}

function ebc_subscribe_to_waveformchanged(func, widget){
	function func_signal (connection, sender, path, iface, signal, params){
		func(connection, sender, path, iface, signal, params, widget);
	}
	PnProxy.connectSignal(
		"WaveformChanged", func_signal
	);
}

// the pinenote-dbus-service can emit a signal which indicates that a
// performance-mode-change was requested
function ebc_subscribe_to_requestperformancemode(func, widget){
	function func_signal (connection, sender, path, iface, signal, params){
		func(connection, sender, path, iface, signal, params, widget);
	}
	PnProxy.connectSignal(
		"ReqQualityOrPerformance", func_signal
	);
}
