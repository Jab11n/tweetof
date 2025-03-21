document.getElementById("navbar").innerHTML = `
    <div class="global-nav">
        <div class="global-nav-inner">
            <div class="container">
                <ul class="nav">
                    <li class="home">
                        <a class="nav-logo-link" href="/">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="139.82647"
                                height="76.23345"
                                viewBox="0 0 139.82647 76.23345"
                                class="Icon"
                            >
                                <g
                                    transform="translate(-148.42025,-159.97693)"
                                    fill="#6366f1"
                                    fill-rule="nonzero"
                                    stroke="#6366f1"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="miter"
                                >
                                    <path
                                        d="M240.98964,234.07309l-10.99794,-21.40463l-10.84799,21.42734l-13.24371,0.10422l-10.97386,-25.36094c0,0 -8.06221,5.86725 -15.74124,5.25956c-10.36394,-0.82017 -17.94116,-11.68014 -17.94116,-11.68014l8.31569,-2.43958c0,0 -4.13802,-0.6402 -8.10856,-2.71451c-7.10581,-2.57287 -8.42205,-8.64914 -8.42205,-8.64914c0,0 3.74335,0.61353 5.77769,0.89382c2.78856,0.38421 4.74975,-0.80039 4.74975,-0.80039c0,0 -2.4774,-0.43436 -6.56725,-4.20953c-4.75427,-4.38846 -6.07417,-13.96126 -6.07417,-13.96126c0,0 11.77972,5.77335 17.98614,5.36999c5.98907,-0.38924 9.17204,-4.19955 9.17204,-4.19955l-4.32303,-9.70833h24.85385l13.47115,36.68333l9.76389,-28.64167l16.32778,-0.04167l9.88333,28.56667l13.4,-36.58974h23.77308l-30.62308,72.02308z"
                                    />
                                </g>
                            </svg>
                        </a>
                    </li>
                </ul>
                <div class="pull-right">
                    <div class="search">
                        <input
                            id="search-query"
                            class="search-input"
                            type="text"
                            placeholder="Search Tweetof"
                            autocomplete="off"
                            spellcheck="false"
                            aria-autocomplete="list"
                            aria-expanded="false"
                        />
                    </div>
                    <a class="nav-account-action" id="nav-login">Log in</a>
                </div>
            </div>
        </div>
    </div>
`;
