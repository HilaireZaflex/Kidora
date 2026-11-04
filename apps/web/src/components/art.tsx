import { useId } from "react";
export function UniverseArt({
  icon,
  color = "#2563EB",
}: {
  icon: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 200 140" aria-hidden="true" className="universe-art">
      <ellipse cx="100" cy="119" rx="53" ry="9" fill="#14213D" opacity=".08" />
      <circle cx="150" cy="32" r="6" fill={color} opacity=".25" />
      <path
        d="M36 54v12m-6-6h12M159 86v10m-5-5h10"
        stroke={color}
        strokeWidth="3"
        opacity=".5"
      />
      {icon === "animal" ? (
        <g>
          <path
            d="M65 71Q42 38 61 27Q80 24 89 55M123 60Q130 26 146 35Q162 45 140 77"
            fill="#F2A653"
            stroke="#D38835"
            strokeWidth="3"
          />
          <path
            d="M61 79Q61 48 101 49Q141 48 143 79L137 108Q100 132 66 106Z"
            fill="#F5BA66"
          />
          <path
            d="M74 69l12 7m25-1 13-8"
            stroke="#B87431"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <ellipse cx="101" cy="100" rx="24" ry="18" fill="#FFF1D9" />
          <circle cx="83" cy="86" r="4" fill="#183F3D" />
          <circle cx="119" cy="86" r="4" fill="#183F3D" />
          <path
            d="m95 94 6 6 6-6m-6 6v7"
            stroke="#183F3D"
            fill="#183F3D"
            strokeWidth="3"
          />
        </g>
      ) : icon === "elephant" ? (
        <g>
          <ellipse cx="68" cy="72" rx="28" ry="38" fill="#81A7AA" />
          <ellipse cx="132" cy="72" rx="28" ry="38" fill="#81A7AA" />
          <ellipse cx="65" cy="73" rx="17" ry="26" fill="#A7C4BF" />
          <ellipse cx="135" cy="73" rx="17" ry="26" fill="#A7C4BF" />
          <path d="M71 67Q70 29 100 29q30 0 29 38l-7 35H78Z" fill="#9AB9B6" />
          <path
            d="M94 82v27q0 22 21 10"
            fill="none"
            stroke="#94B3B1"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M84 92q-15 19-17 2m49-2q15 19 17 2"
            fill="none"
            stroke="#FFF1CF"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="85" cy="74" r="4" fill="#254D50" />
          <circle cx="115" cy="74" r="4" fill="#254D50" />
          <path
            d="M92 52h16m-17 8h18"
            fill="none"
            stroke="#80A2A2"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ) : icon === "space" ? (
        <g transform="rotate(-24 100 75)">
          <ellipse cx="100" cy="76" rx="39" ry="38" fill="#A99CF3" />
          <path
            d="M74 48q25 15 51 3M65 75q38 20 74 6M74 99q23 8 45 4"
            stroke="#8070D5"
            strokeWidth="9"
            fill="none"
          />
          <ellipse
            cx="100"
            cy="80"
            rx="70"
            ry="15"
            fill="none"
            stroke="#F9C56A"
            strokeWidth="12"
          />
          <path
            d="M35 76q10 23 73 21"
            stroke="#FFE2A6"
            strokeWidth="4"
            fill="none"
          />
        </g>
      ) : icon === "science" ? (
        <g fill="none" stroke="#56B9C3" strokeWidth="6">
          <ellipse cx="100" cy="78" rx="57" ry="21" />
          <ellipse
            cx="100"
            cy="78"
            rx="57"
            ry="21"
            transform="rotate(60 100 78)"
          />
          <ellipse
            cx="100"
            cy="78"
            rx="57"
            ry="21"
            transform="rotate(-60 100 78)"
          />
          <circle cx="100" cy="78" r="12" fill="#F2B65B" stroke="none" />
          <circle cx="151" cy="69" r="7" fill="#165A5D" stroke="none" />
        </g>
      ) : icon === "earth" ? (
        <g>
          <circle cx="100" cy="75" r="46" fill="#72BFDC" />
          <path
            d="m71 41 25-5 15 19-6 16 23 6-8 22-17 20-13-13-4-27-24-12Z"
            fill="#7BB877"
          />
          <path
            d="m126 41 13 15-14 11-10-9m16 32 12-9 1 16-12 9"
            fill="#BBDA91"
          />
          <path
            d="M88 31q-25 43 2 87"
            stroke="white"
            strokeWidth="4"
            opacity=".22"
            fill="none"
          />
        </g>
      ) : icon === "nature" ? (
        <g>
          <path d="M100 119V69" stroke="#866245" strokeWidth="10" />
          <path d="M100 97Q42 94 47 44Q98 34 100 97" fill="#4EAA77" />
          <path d="M101 79q-3-54 48-54 10 49-48 54" fill="#8BBE6F" />
          <path d="m68 61 31 38m29-55-28 36" stroke="#D4E8AD" strokeWidth="3" />
        </g>
      ) : icon === "history" || icon === "culture" ? (
        <g>
          <path d="m48 59 52-32 52 32Z" fill="#E8AC68" />
          <path d="M54 62h92v10H54zm-8 46h108v12H46z" fill="#C98B4C" />
          <path
            d="M66 72v36m22-36v36m24-36v36m22-36v36"
            stroke="#E5B67C"
            strokeWidth="12"
          />
        </g>
      ) : icon === "body" ? (
        <g fill="#F3A7A0">
          <circle cx="100" cy="39" r="17" />
          <path d="M78 65q22-10 44 0l19 27-13 9-15-20v39H88V81l-15 20-13-9Z" />
          <path d="M99 76c-15-17-27 8 1 22 28-14 14-39-1-22" fill="#D36C76" />
        </g>
      ) : icon === "tech" ? (
        <g>
          <path d="M100 44V29" stroke="#418F9A" strokeWidth="5" />
          <circle cx="100" cy="25" r="7" fill="#F2B65B" />
          <rect x="56" y="44" width="88" height="65" rx="22" fill="#72B5C0" />
          <rect x="66" y="55" width="68" height="38" rx="13" fill="#174F57" />
          <circle cx="84" cy="72" r="6" fill="#AEF2D4" />
          <circle cx="116" cy="72" r="6" fill="#AEF2D4" />
          <path
            d="M88 85q12 8 24 0"
            fill="none"
            stroke="#AEF2D4"
            strokeWidth="3"
          />
          <path
            d="M48 67v23m104-23v23"
            stroke="#F2B65B"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      ) : icon === "volcano" ? (
        <g>
          <path d="m44 118 39-69 31 1 45 68" fill="#AA8A86" />
          <path d="m83 49-12 27 16-6 13 11 11-13 18 8-15-26" fill="#EE9874" />
          <path
            d="M98 39Q79 21 90 17m21 22q25-15 11-28"
            fill="none"
            stroke="#E8B17F"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
      ) : icon === "art" ? (
        <g>
          <path
            d="M139 73q27 46-21 48c-9 0-8-18-20-18s-17 15-31 6C15 72 76 16 116 34q40 14 23 39"
            fill="#E8C291"
          />
          <circle cx="74" cy="61" r="9" fill="#6DACBD" />
          <circle cx="100" cy="48" r="9" fill="#DA8E8E" />
          <circle cx="124" cy="61" r="9" fill="#8FAC71" />
          <path d="m91 104 47-61" stroke="#64548C" strokeWidth="9" />
          <path d="m134 47 13-23q16 4 4 18Z" fill="#C17D9D" />
        </g>
      ) : icon === "logic" ? (
        <g>
          <rect
            x="46"
            y="47"
            width="53"
            height="53"
            rx="12"
            fill="#EBC16B"
            transform="rotate(-12 70 70)"
          />
          <rect
            x="100"
            y="66"
            width="53"
            height="53"
            rx="12"
            fill="#9DA7DA"
            transform="rotate(9 126 90)"
          />
          <path
            d="M61 72h22m-11-11v22m42 5h23m-23 12h23"
            stroke="white"
            strokeWidth="5"
          />
        </g>
      ) : icon === "book" ? (
        <g>
          <path
            d="M100 51Q72 34 44 48v65q28-14 56 2 28-16 56-2V48q-28-14-56 3"
            fill="#AD9BD1"
          />
          <path
            d="M100 58Q74 42 52 54v48q24-8 48 6 24-14 48-6V54q-22-12-48 4"
            fill="#FFF5DC"
          />
          <path
            d="M100 58v50m-38-43 25 4m-25 9 25 4m27-13 23-4m-23 17 23-4"
            stroke="#C8BBA3"
            strokeWidth="3"
          />
        </g>
      ) : (
        <g>
          <path
            d="M78 82C44 54 80 20 107 31c38 7 38 35 17 52l-8 14H87Z"
            fill="#F1C76C"
          />
          <path
            d="M90 103h25m-22 10h19"
            stroke="#8D9B8D"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="m89 68 13 11 13-16m-13 16v17"
            stroke="#C79845"
            strokeWidth="4"
            fill="none"
          />
        </g>
      )}
    </svg>
  );
}
export function AdventureArt() {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      viewBox="0 0 620 480"
      role="img"
      aria-label="Une petite planète imaginaire, une fusée et Kiro le robot, entourés de nature"
      className="adventure-art"
    >
      <defs>
        <radialGradient id={`${id}sea`} cx=".3" cy=".25">
          <stop stopColor="#A6DED4" />
          <stop offset=".65" stopColor="#62B4AB" />
          <stop offset="1" stopColor="#267A79" />
        </radialGradient>
        <linearGradient id={`${id}land`} x2=".8" y2="1">
          <stop stopColor="#CAE5A1" />
          <stop offset="1" stopColor="#73AD73" />
        </linearGradient>
        <linearGradient id={`${id}rock`} x2=".3" y2="1">
          <stop stopColor="#D4B492" />
          <stop offset="1" stopColor="#877F71" />
        </linearGradient>
        <linearGradient id={`${id}rocket`} x2="1" y2="1">
          <stop stopColor="#FFFAE8" />
          <stop offset="1" stopColor="#DBCCB1" />
        </linearGradient>
        <filter id={`${id}shadow`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="12"
            floodColor="#27625D"
            floodOpacity=".16"
          />
        </filter>
      </defs>
      <circle cx="323" cy="232" r="194" fill="#E4EEDF" />
      <circle
        cx="323"
        cy="232"
        r="218"
        fill="none"
        stroke="#BDCEC0"
        strokeDasharray="3 11"
      />
      <g fill="#C48A45">
        <path d="m111 118 4 10 11 4-11 4-4 11-4-11-11-4 11-4Zm374 228 4 10 11 4-11 4-4 11-4-11-11-4 11-4Z" />
        <circle cx="464" cy="70" r="4" />
        <circle cx="177" cy="353" r="3" />
      </g>
      <g filter={`url(#${id}shadow)`}>
        <circle cx="315" cy="235" r="132" fill={`url(#${id}sea)`} />
        <path
          d="m231 137 42-20 40 19 13 29 38 12-12 30-31 7 8 30-27 30-24 4-8 45-22 11-18-36 5-43-30-19-11-42 13-25Z"
          fill={`url(#${id}land)`}
        />
        <path
          d="m402 190 26 30-11 25-23 8-9 40-21 13-13-29 18-30-7-26Z"
          fill="#AAD18B"
        />
        <path
          d="M246 135q-42 88-6 155"
          stroke="#EAFCEB"
          strokeWidth="8"
          opacity=".2"
          fill="none"
        />
        <path
          d="M228 287q85 24 169-3l-17 73-48 39-57-17Z"
          fill={`url(#${id}rock)`}
        />
        <path
          d="m228 287 47 92 15-83m42 100 11-96 37 57"
          stroke="#B8A086"
          strokeWidth="2"
          fill="none"
        />
        <ellipse cx="311" cy="285" rx="91" ry="30" fill="#92C786" />
        <path
          d="M239 289q54-21 133-5"
          fill="none"
          stroke="#E1DBAD"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <g>
          <path d="M249 275v-68" stroke="#967250" strokeWidth="8" />
          <path d="m249 161-30 65h59Z" fill="#5A9470" />
          <path d="m249 187-37 62h73Z" fill="#75AE7B" />
          <path d="M384 282v-54" stroke="#967250" strokeWidth="7" />
          <circle cx="384" cy="217" r="25" fill="#8FBC7B" />
          <circle cx="374" cy="211" r="19" fill="#A9D38B" />
        </g>
        <g transform="translate(287 213)">
          <path d="m-16 37 16-37 17 37" fill="#F3C66B" />
          <path d="M-9 37V23h18v14" fill="#FFE2A2" />
          <path d="M-3 37V27h6v10" fill="#726A51" />
        </g>
      </g>
      <g transform="translate(423 104) rotate(28)">
        <path d="m-16 53-11 22 14-5m29-17 11 22-14-5" fill="#E29572" />
        <path d="M0 0q-29 28-16 68h32Q29 28 0 0" fill={`url(#${id}rocket)`} />
        <path d="M0 0q-10 10-16 25h32Q10 10 0 0" fill="#DC8E6B" />
        <circle
          cx="0"
          cy="38"
          r="10"
          fill="#4F8E98"
          stroke="#B8C6BD"
          strokeWidth="4"
        />
        <path d="m-9 73 9 29 9-29" fill="#F2C671" />
      </g>
      <g transform="translate(128 293) rotate(-9)" filter={`url(#${id}shadow)`}>
        <path d="M0-21v-16" stroke="#608B87" strokeWidth="4" />
        <circle cy="-40" r="6" fill="#E6B65C" />
        <rect x="-35" y="-21" width="70" height="56" rx="19" fill="#F7ECD2" />
        <rect x="-27" y="-12" width="54" height="33" rx="11" fill="#29676A" />
        <circle cx="-12" cy="2" r="5" fill="#AEE8D2" />
        <circle cx="12" cy="2" r="5" fill="#AEE8D2" />
        <path
          d="M-9 13q9 7 18 0"
          stroke="#AEE8D2"
          strokeWidth="2"
          fill="none"
        />
        <rect x="-22" y="38" width="44" height="31" rx="12" fill="#E7B567" />
        <path
          d="m-30 44-13 14m73-14 12-17"
          stroke="#7EA8A0"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="m-13 68-4 13m30-13 4 13"
          stroke="#497D7C"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(480 256) rotate(-20)">
        <ellipse rx="45" ry="14" fill="none" stroke="#D7B68B" strokeWidth="5" />
        <circle r="26" fill="#E6C399" />
        <path
          d="M-14-17q18 6 33 0M-22 1q22 12 43 3"
          fill="none"
          stroke="#C8A47E"
          strokeWidth="6"
        />
        <path
          d="M-45 0q4 18 58 12"
          fill="none"
          stroke="#E9D2AE"
          strokeWidth="6"
        />
      </g>
      <g fill="#FFFDF0">
        <ellipse cx="199" cy="98" rx="32" ry="12" />
        <circle cx="197" cy="89" r="15" />
        <ellipse cx="451" cy="376" rx="38" ry="12" />
        <circle cx="451" cy="367" r="15" />
      </g>
      <path
        d="M180 410q133 22 249-9"
        fill="none"
        stroke="#AFC8BB"
        strokeWidth="2"
      />
    </svg>
  );
}
