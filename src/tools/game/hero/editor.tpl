<div id="hero-editor">
    <style>
        
        .hero-{hero_id}-editor-panel.ui-tabs-panel {
            height: 320px;
        }
        
        .hero-{hero_id}-skills-list > div.secondary-skill {
            display: inline-block;
            float: left;
            width: 45%;
            margin: 5px;
            height: 32px;
        }
        
        .hero-{hero_id}-skills-list > div.secondary-skill > div.g-sk {
            float: left;
            margin-right: -4px;
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
                        <td style="width: 90px" align="center">
                            <img src="{icon}" border="0" /><br />
                            {name}
                        </td>
                        <td>
                            <table style="width: 100%">
                                <tr>
                                    <td align="center" rowspan="2" >
                                        Level<br />
                                        {level}<br />
                                        {race}
                                    </td>
                                    <td>
                                        <div class="g-sk experience small" title="Experience"></div>
                                    </td>
                                    <td>
                                        <div class="g-sk attack small" title="Attack"></div>
                                    </td>
                                    <td>
                                        <div class="g-sk defense small" title="Defense"></div>
                                    </td>
                                    <td>
                                        <div class="g-sk spell-power small" title="Spell Power"></div>
                                    </td>
                                    <td>
                                        <div class="g-sk knowledge small" title="Knowledge"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        {xp}
                                    </td>
                                    <td align="center">
                                        {sk_attack}
                                    </td>
                                    <td align="center">
                                        {sk_defense}
                                    </td>
                                    <td align="center">
                                        {sk_spell_power}
                                    </td>
                                    <td align="center">
                                        {sk_knowledge}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="hero-{hero_id}-skills-list">
                            <!-- BEGIN: secondary_skill -->
                            <div class="secondary-skill">
                                <div class="g-sk {skill_name} {skill_level} small"></div>
                                {skill_level}<br />{skill_name}
                            </div>
                            <!-- END: secondary_skill -->
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