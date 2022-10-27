<!--
 * @Author: chenxiaoxuan
 * @Date: 2022-10-26 13:36:53
 * @LastEditTime: 2022-10-26 17:02:00
 * @LastEditors: chenxiaoxuan
 * @Description: 
-->
<template>
  <div class="ShadowAnalysis">
    <div style="color: white">阴影分析</div>
    <div class="param-item">
        <b>日期选择：</b>
        <input id="selDate" type="date" value="2017-05-13"/>
    </div>
    <div class="param-item">
        <b>开始时间：</b>
        <select id="startTime" class="form-control">
            <option value="0">0:00</option>
            <option value="2">2:00</option>
            <option value="4">4:00</option>
            <option value="6">6:00</option>
            <option value="8">8:00</option>
            <option value="10" selected>10:00</option>
            <option value="12">12:00</option>
            <option value="14">14:00</option>
            <option value="16">16:00</option>
            <option value="18">18:00</option>
            <option value="20">20:00</option>
            <option value="22">22:00</option>
        </select>
    </div>
    <div class="param-item">
        <b>结束时间：</b>
        <select id="endTime" class="form-control">
            <option value="2">2:00</option>
            <option value="4">4:00</option>
            <option value="6">6:00</option>
            <option value="8">8:00</option>
            <option value="10">10:00</option>
            <option value="12" selected>12:00</option>
            <option value="14">14:00</option>
            <option value="16">16:00</option>
            <option value="18">18:00</option>
            <option value="20">20:00</option>
            <option value="22">22:00</option>
            <option value="24">24:00</option>
        </select>
    </div>
    <div class="param-item">
        <b>底部高程：</b>
        <input id="bottomHeight" value="20"/>
    </div>
    <div class="param-item">
        <b>拉伸高度：</b>
        <input id="extrudeHeight" value="20"/>
    </div>
    <div class="param-item">
        <button type="button" id="shadowAnalysis" class="button black">阴影分析</button>
        <button type="button" id="sunlight" class="button black">日照效果</button>
        <button type="button" id="clear" class="button black">清除</button>
        <button type="button" id="shadowRadio" class="button black">获取阴影率</button>
    </div>
    <div id="shadowRadioBox">
        <table style="color:#000">
            <caption id="title"><b>阴影率窗口</b></caption>
            <tr>
                <td><b>阴影率：</b></td>
                <td><input type="text" id="shadowRadioText" class="displayText" readonly/></td>
            </tr>
            <tr>
                <td><b>经度：</b></td>
                <td><input type="text" id="longitudeText" readonly class="displayText"></td>
            </tr>
            <tr>
                <td><b>纬度：</b></td>
                <td><input type="text" id="latitudeText" readonly class="displayText"></td>
            </tr>
            <tr>
                <td><b>高程：</b></td>
                <td><input type="text" id="heightText" readonly class="displayText"></td>
            </tr>

        </table>
    </div>
  </div>
</template>

