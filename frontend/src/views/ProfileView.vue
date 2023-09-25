<template>

    <div class="profile">
        
        <!-- Profile Header (Username, Avatar, Achievements, Stats) -->
        <div class="profile-header">
            <div class="profile-info">
                <h2 class="text-2xl font-bold">  Username </h2>
                <img  alt="Avatar" class="w-12 h-12 rounded-full" /> <!-- :src="userProfile.avatar" -->
            </div>
            
            <!-- Display Achievements (replace with actual data) -->
            <div class="achievements">

                <!-- v-for="achievement in userProfile.achievements" :key="achievement.id" -->
                <div  class="achievement">
                    <span> Achievements </span>
                </div>
            </div>
            
            <div class="stats">
                <div>Total Wins: 0 </div>
                <div>Total Losses: 0</div>
            </div>
        </div>
    
        <!-- Match History -->
        <div class="match-history">
            <h3 class="text-xl font-semibold mb-4">Match History</h3>
            <table class="w-full">
            <thead>
                <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Score</th>
                </tr>
            </thead>
            <tbody>
                Display Match History (replace with actual data)
                <!-- v-for="match in userProfile.matchHistory" :key="match.id" -->
                <tr >
                <td>date</td>
                <td>opponent</td>
                <td>score</td>
                </tr>
            </tbody>
            </table>
        </div>
    
        <!-- Game Ladder -->
         <div class="game-ladder">
            <!-- <h3 class="text-xl font-semibold mb-4">Game Ladder</h3>
            <table class="w-full">
            <thead>
                <tr>
                <th>Player</th>
                <th>Points</th>
                </tr>
            </thead>
            <tbody>
                Display Game Ladder (replace with actual data)
                <tr v-for="player in userProfile.gameLadder" :key="player.id">
                <td>{{ player.name }}</td>
                <td>{{ player.points }}</td>
                </tr>
            </tbody>
            </table> -->
        </div>
    </div>
</template> 

  