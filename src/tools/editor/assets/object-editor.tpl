<div>
    <div class="tabs object-editor">
        <ul>
            <li><a href="#o-general-{object_id}">General</a></li>
            <li><a href="#o-animation-{object_id}">Frames ({object_frames})</a></li>
            <li><a href="#o-dynamics-{object_id}">Dynamics</a></li>
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
                        <td><input type="text" data-property-name="name" value="{name}" disabled /></td>
                    </tr>
                    <tr>
                        <td>Caption:</td>
                        <td><input type="text" data-property-name="caption" value="{caption}" /></td>
                    </tr>
                    <tr>
                        <td>Type:</td>
                        <td><input type="number" data-property-name="type" value="{objectType}" disabled /></td>
                    </tr>
                    <tr>
                        <td>Dimensions (px):</td>
                        <td style="text-align: left" >
                            <input type="number" style="width: 80px" data-property-name="width" min="0" value="{width}" disabled />
                            ,
                            <input type="number" style="width: 80px" data-property-name="height" min="0" value="{height}" disabled />
                        </td>
                    </tr>
                    <tr>
                        <td>Keywords:</td>
                        <td>
                            <input type="text" data-property-name="keywords" value="{keywords}" />
                        </td>
                    </tr>
                    <tr>
                        <td>Object Class:</td>
                        <td>
                            <select data-property-name="objectClass">
                                <option value="">- Not set -</option>
                                <option value="AdventureItem">Adventure Item</option>
                                <option value="Artifact">Artifact</option>
                                <option value="Castle">Castle</option>
                                <option value="Creature_Adventure">Creature Adventure</option>
                                <option value="Creature_Combat">Creature Combat</option>
                                <option value="Dwelling">Dwelling</option>
                                <option value="Hero">Hero</option>
                                <option value="Hero_Embarked">Hero (on water)</option>
                                <option value="Mine">Mine</option>
                                <option value="Resource">Resource</option>
                                <option value="Tileset">Tileset</option>
                            </select>
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
            <table class="property-grid cols-3" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <td>Property</td>
                        <td>Value</td>
                        <td>&nbsp</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 20%">Hotspot point:</td>
                        <td style="width: 20%; text-align: left">
                            <input type="number" style="width: 80px" data-property-name="hsx" min="0" max="{maxc}" value="{hsx}"/>
                            :
                            <input type="number" style="width: 80px" data-property-name="hsy" min="0" max="{maxr}" value="{hsy}"/>
                        </td>
                        <td style="width: 60%" rowspan="2">
                            <div class="joystick">
                                <div class="n"></div>
                                <div class="s"></div>
                                <div class="w"></div>
                                <div class="e"></div>
                                <div class="nw"></div>
                                <div class="ne"></div>
                                <div class="sw"></div>
                                <div class="se"></div>
                                <div class="c"></div>
                            </div>
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
                        <td style="text-align: left" colspan="2">
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
        <div id="o-dynamics-{object_id}">
            <p>Select how this object affects the movement of the other objects</p>
            <p><label>
                <input type="checkbox" data-property-name="dynamics_walk" /> Other objects can <b>walk</b> over this object
               </label>
            </p>
            <p><label>
                <input type="checkbox" data-property-name="dynamics_swim" /> Other objects can <b>swim</b> over this object
               </label>
            </p>
            <p><label>
                <input type="checkbox" data-property-name="dynamics_fly" /> Other objects can <b>fly</b> over this object
                </label>
            </p>
        </div>
    </div>
</div>