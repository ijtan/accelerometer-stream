# read 'plots.json' and draw anytime json changes
import json
import os
import matplotlib.pyplot as plt

plt_mot_history = {'x': [], 'y': [], 'z': [], 'time': []}
plt_or_history = {'alpha': [], 'beta': [], 'gamma': [], 'time': []}

motion_path = 'Motion.json'
orientation_path = 'Orientation.json'


def get_data():
    plt_or_history = []
    plt_mot_history = []
    try:
        with open(motion_path, 'r') as f:
            plt_mot_history = json.load(f)
        with open(orientation_path, 'r') as f:
            plt_or_history = json.load(f)
    except FileNotFoundError:
        print('File not found')
    except json.decoder.JSONDecodeError:
        print('JSON error')

    return plt_mot_history, plt_or_history

while True:
    motion_data, orientation_data = get_data()
    # print(motion_data.keys())
    # print(orientation_data.keys())

    plt.subplot(2, 1, 1)
    plt.plot(motion_data['time'], motion_data['x'], 'r')
    plt.plot(motion_data['time'], motion_data['y'], 'g')
    plt.plot(motion_data['time'], motion_data['z'], 'b')
    plt.subplot(2, 1, 2)
    plt.plot(orientation_data['time'], orientation_data['alpha'], 'r')
    plt.plot(orientation_data['time'], orientation_data['beta'], 'g')
    plt.plot(orientation_data['time'], orientation_data['gamma'], 'b')
    plt.pause(0.001)
    plt.draw()
    plt.clf()