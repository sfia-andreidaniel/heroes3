<div>
    <div class="tabs object-editor">
        <ul>
            <li><a href="#o-general-{object_id}">General</a></li>
            <li><a href="#o-animation-{object_id}">Frames</a></li>
        </ul>
        <div id="o-general-{object_id}" class="object-editor-sheet">
            <table class="property-grid" cellpadding=0 cellspacing=0 width="100%" >
                <thead>
                    <tr>
                        <td>Property</td>
                        <td>Value</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name:</td>
                        <td><input type="text" data-property-name="name" value="{name}" /></td>
                    </tr>
                    <tr>
                        <td>Caption:</td>
                        <td><input type="text" data-property-name="caption" value="{caption}" /></td>
                    </tr>
                    <tr>
                        <td>Type:</td>
                        <td><input type="number" data-property-name="type" value="{objectType}" /></td>
                    </tr>
                    <tr>
                        <td>Dimensions (px):</td>
                        <td style="text-align: left" >
                            <input type="number" style="width: 80px" data-property-name="width" min="0" value="{width}" />
                            ,
                            <input type="number" style="width: 80px" data-property-name="height" min="0" value="{height}"/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="o-animation-{object_id}" >
            <div class="form">
                <label>
                    <span class="label">Animations:</span>
                    <select data-property-name="animations">
                        <option value="">*</option>
                        <!-- BEGIN: animation_frame_index -->
                        <option value="{index}">{index}</option>
                        <!-- END: animation_frame_index -->
                    </select>
                </label>
                <label>
                    <span class="label">Play frames:</span>
                    <input type="checkbox" data-property-name="pause_play" />
                </label>
                <label>
                    <span class="label">Frame:</span>
                    <input type="range" min="0" max="{object_frames}" value="0" data-property-name="frame_index" style="vertical-align: middle" />
                </label>
            </div>
            <div class="object-player" style="width: {object_width}px; height: {object_height}px;">
                <canvas data-property-name="player" width="{object_width}" height="{object_height}"></canvas>
                <div class="hotspot"></div>
                <div class="enterpoint"></div>
            </div>
            <table class="property-grid" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <td>Property</td>
                        <td>Value</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Hotspot point:</td>
                        <td style="text-align: left">
                            <input type="number" style="width: 80px" data-property-name="hsx" min="0" max="{maxc}" value="{hsx}"/>
                            :
                            <input type="number" style="width: 80px" data-property-name="hsy" min="0" max="{maxr}" value="{hsy}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>Enter point:</td>
                        <td style="text-align: left">
                            <input type="number" style="width: 80px" data-property-name="epx" min="0" max="{maxc}" value="{epx}"/>
                            :
                            <input type="number" style="width: 80px" data-property-name="epy" min="0" max="{maxr}" value="{epy}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>Crop:</td>
                        <td style="text-align: left">
                            <input type="number" style="width: 80px" data-property-name="crop_left" min=0 max="{maxc}" value="0" title="left" />
                            ,
                            <input type="number" style="width: 80px" data-property-name="crop_right" min=0 max="{maxc}" value="0" title="right" />
                            ,
                            <input type="number" style="width: 80px" data-property-name="crop_top" min=0 max="{maxr}" value="0" title="top" />
                            ,
                            <input type="number" style="width: 80px" data-property-name="crop_bottom" min=0 max="{maxr}" value="0" title="bottom" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>