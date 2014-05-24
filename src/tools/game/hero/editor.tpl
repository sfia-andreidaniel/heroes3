<div id="hero-editor">
    <style>
        
        .hero-{hero_id}-editor-panel.ui-tabs-panel {
            height: 220px;
        }
        
        .hero-{hero_id}-skills-list {
            display: block;
            height: 135px;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        
    </style>
    <div class="tabs">
        <ul>
            <li>
                <a href="#hero-{hero_id}-general">
                    General
                </a>
            </li>
            <li>
                <a href="#hero-{hero_id}-artifacts">
                    Artifacts
                </a>
            </li>
            <li>
                <a href="#hero-{hero_id}-armies">
                    Armies
                </a>
            </li>
            <li>
                <a href="#hero-{hero_id}-spells">
                    Spells
                </a>
            </li>
        </ul>
        <div id="hero-{hero_id}-general" class="hero-{hero_id}-editor-panel" >
            <table style="width: 100%">
                <tbody>
                    <tr>
                        <td style="width: 90px">
                            <img src="{icon}" border="0" />
                        </td>
                        <td style="width: 115px">
                            {name}
                        </td>
                        <td style="width: 100px">
                            Level: {level}<br />
                            XP: {xp}<br />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            Skills:<br />
                            
                            <div class="hero-{hero_id}-skills-list">
                            </div>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="hero-{hero_id}-artifacts" class="hero-{hero_id}-editor-panel" >
        </div>
        <div id="hero-{hero_id}-armies" class="hero-{hero_id}-editor-panel" >
        </div>
        <div id="hero-{hero_id}-spells" class="hero-{hero_id}-editor-panel" >
        </div>
    </div>
</div>