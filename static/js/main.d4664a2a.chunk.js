(this["webpackJsonpgps-draw"]=this["webpackJsonpgps-draw"]||[]).push([[0],{19:function(t,e,a){t.exports=a(27)},26:function(t,e,a){},27:function(t,e,a){"use strict";a.r(e);var n=a(0),o=a.n(n),s=a(15),i=a.n(s),r=a(7),c=a(8),l=a(12),p=a(10),h=a(18),u=a(31),m=a(32),d=a(33),g=a(29),f=a(30);function v(t){return t*Math.PI/180}var y=function(t){Object(l.a)(a,t);var e=Object(p.a)(a);function a(){var t;Object(r.a)(this,a);for(var n=arguments.length,o=new Array(n),s=0;s<n;s++)o[s]=arguments[s];return(t=e.call.apply(e,[this].concat(o))).state={center:[49.5609117,15.9407],zoom:17,location:[49.5609117,15.9407],points:[],pointId:0},t.shape=[[49.560361,15.941539],[49.560353,15.941695],[49.560309,15.941829],[49.560183,15.941898],[49.5601,15.941834],[49.560068,15.941652],[49.560134,15.941491],[49.560235,15.941448],[49.560312,15.941491],[49.56034,15.941491],[49.560058,15.941169],[49.55994,15.941163],[49.559838,15.941292],[49.559863,15.941512],[49.559943,15.941593],[49.560037,15.941587],[49.560093,15.941507],[49.56011,15.941378],[49.560089,15.94126],[49.559916,15.941652],[49.559856,15.94178],[49.559797,15.941925],[49.559727,15.942059],[49.559672,15.942199],[49.559616,15.94229],[49.559568,15.94236],[49.559557,15.942488],[49.559616,15.942596],[49.559706,15.942606],[49.559741,15.942542],[49.559769,15.942446],[49.559787,15.942338],[49.559682,15.942242],[49.559814,15.942301],[49.559902,15.942129],[49.559943,15.941995],[49.560002,15.941898],[49.560058,15.941727]],t}return Object(c.a)(a,[{key:"drawEnabled",get:function(){return this.state.pointId<this.shape.length&&this.state.pointId>0}},{key:"positionChanged",value:function(t){var e={};this.drawEnabled&&(this.state.points.push(t),e.points=Object(h.a)(this.state.points)),this.state.pointId<this.shape.length&&function(t,e){var a=v(t[1]),n=v(t[0]),o=v(e[1]),s=v(e[0]),i=s-n,r=o-a,c=Math.pow(Math.sin(i/2),2)+Math.cos(n)*Math.cos(s)*Math.pow(Math.sin(r/2),2);return 6371*(2*Math.asin(Math.sqrt(c)))*1e3}(t,this.shape[this.state.pointId])<5&&(e.pointId=this.state.pointId+1),e.location=t,this.setState(e)}},{key:"render",value:function(){var t=this;return o.a.createElement(u.a,{viewport:{center:this.state.center,zoom:this.state.zoom},zoomControl:!1,onmousemove:function(e){t.positionChanged([e.latlng.lat,e.latlng.lng])},onViewportChange:function(e){t.setState({center:e.center,zoom:e.zoom})},maxZoom:20},o.a.createElement(m.a,{position:"topright"}),o.a.createElement(d.a,{url:"https://mapserver.mapy.cz/ophoto-m/{z}-{x}-{y}",opacity:.3}),o.a.createElement(g.a,{color:"black",positions:this.state.points}),o.a.createElement(f.a,{center:this.state.location,radius:10,color:"transparent",fillColor:"#7579EE",fillOpacity:.5}),this.state.pointId<this.shape.length&&o.a.createElement(f.a,{center:this.shape[this.state.pointId],radius:10,color:"transparent",fillColor:"black",fillOpacity:.5}),o.a.createElement("img",{src:"/GpsDraw/assets/ostrovy-logo.png",alt:"Ostrovy pohody",className:"logoOp"}),o.a.createElement("img",{src:"/GpsDraw/assets/duha-logo.png",alt:"Duha AZ",className:"logoDuha"}))}}]),a}(o.a.Component),E=(a(26),function(t){Object(l.a)(a,t);var e=Object(p.a)(a);function a(){return Object(r.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return o.a.createElement(y,null)}}]),a}(o.a.Component));i.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(E,null)),document.getElementById("root"))}},[[19,1,2]]]);
//# sourceMappingURL=main.d4664a2a.chunk.js.map