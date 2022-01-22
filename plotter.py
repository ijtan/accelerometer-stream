# read 'plots.json' and draw anytime json changes
import json
import os
import matplotlib.pyplot as plt
file_path = 'plots.json'
plt_mot_history = {'x': [], 'y': [], 'z': []}
plt_or_history = {'alpha': [], 'beta': [], 'gamma': []}

while True:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            plt.clf()
            try:
                plt_or_history = json.load(f)
            except json.decoder.JSONDecodeError:
                continue
            plt.plot(plt_or_history['alpha'], label='alpha')
            plt.plot(plt_or_history['beta'], label='beta')
            plt.plot(plt_or_history['gamma'], label='gamma')
            plt.legend()
            plt.draw()
            plt.pause(0.00001)
    else:
        print('no file')
        exit()