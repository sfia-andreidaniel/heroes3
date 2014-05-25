<div class="hero-levelup-{hero_id}">

    <style>
        
        .hero-levelup-{hero_id} td.selectable-skill {
            cursor: pointer;
            padding: 10px;
        }
        
        .hero-levelup-{hero_id} td.selectable-skill.selected {
            background-color: #4d2f0c;
            color: white;
        }
        
    </style>

    <table border="0" style="width: 100%" cellpadding="5">
        <tbody>
            <tr>
                <td style="width: 10%">
                    <img src="{icon}" style="border: 0px;" />
                </td>
                <td style="vertical-align: top">
                    {name} has reached <b>level {level}</b>.
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center">
                    <div class="g-sk {primary_skill}"></div><br />
                    <b>+1 {primary_skill}</b>
                </td>
            </tr>
            <tr>
                <!-- BEGIN: no_skills -->
                <td colspan="2"></td>
                <!-- END: no_skills -->
                <!-- BEGIN: one_skill -->
                <td colspan="2" style="text-align: center">
                    <div class="g-sk {secondary_skill_level} {secondary_skill}"></div><br />
                    {name} has learned <b>{secondary_skill_level} {secondary_skill}</b>.
                </td>
                <!-- END: one_skill -->
                <!-- BEGIN: two_skills -->
                <td colspan="2">
                    <table style="width: 100%" cellspacing="5">
                        <tr>
                            <td colspan="2">Please choose which skill you want to learn / upgrade.</td>
                        </tr>
                        <tr>
                            <!-- BEGIN: skill -->
                            <td style="text-align: center" class="selectable-skill" >
                                <div data-skill-name="{secondary_skill_prop_name}" 
                                     class="g-sk {secondary_skill_level} {secondary_skill}"
                                ></div><br />
                                {secondary_skill_level} {secondary_skill}
                            </td>
                            <!-- END: skill -->
                        </tr>
                    </table>
                </td>
                <!-- END: two_skills -->
            </tr>
        </tbody>
    </table>
</div>