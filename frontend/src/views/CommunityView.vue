<template>
  <div class="flex">

    <!-- First Column -->
    <div class="w-1/3 p-4">
      <div class="text-xl font-bold mb-4">Channels</div>
      
      <button
        @click="showCreateChatroomModal = true"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-green active:bg-green-700"
      >
        New channel
      </button>

      <!-- Chatroom Creation Modal (Conditional) -->
      <div
        v-if="showCreateChatroomModal"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background: rgba(0, 0, 0, 0.5)"
      >
        <div class="bg-white p-8 rounded shadow-md w-1/2">
          <h2 class="text-2xl font-semibold mb-4">Create Chatroom</h2>
          <div class="mb-4">
            <label for="chatroomName" class="block text-gray-700 font-semibold">Name</label>
            <input
              v-model="newChatroom.name"
              type="text"
              id="chatroomName"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:shadow-outline-blue"
            />
          </div>
          <div class="mb-4">
            <label for="chatroomPassword" class="block text-gray-700 font-semibold">Password (Optional)</label>
            <input
              v-model="newChatroom.password"
              type="password"
              id="chatroomPassword"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:shadow-outline-blue"
            />
          </div>
          <div class="text-right">
            <button
              @click="createChatroom"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700"
            >
              Create
            </button>
            <button
              @click="showCreateChatroomModal = false"
              class="ml-2 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Loop through chat rooms (replace with actual data) -->
        <div
          v-for="room in chatRooms"
          :key="room.id"
          class="flex justify-between items-center bg-white p-4 rounded shadow"
        >
          <span class="text-lg">{{ room.name }}</span>
          <button
            @click="joinRoom(room.id)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700"
          >
            Join
          </button>
        </div>
      </div>
    </div>



    
    <!-- Second Column -->
    <div class="w-1/3 p-4">
      <div class="text-xl font-bold mb-4">Chat</div>
      <div class="chat-messages">
        <!-- Loop through chat messages (replace with actual data) -->
        <div
          v-for="message in chatMessages"
          :key="message.id"
          class="mb-2"
        >
          <!-- Display player name with distinct colors -->
          <span
            class="text-lg"
            :class="{
              'text-owner': message.isOwner,
              'text-admin': message.isAdmin,
            }"
          >
            {{ message.playerName }}:
          </span>
          <!-- Display message content -->
          <span>{{ message.content }}</span>
        </div>
      </div>
    </div>

    <!-- Third Column -->
    <div class="w-1/3 p-4">
      <div class="text-xl font-bold mb-4">Players</div>
      <div class="space-y-4">
        <!-- Loop through players (replace with actual data) -->
        <div
          v-for="player in players"
          :key="player.id"
          class="flex justify-between items-center p-4 rounded shadow"
          :class="{
            'bg-owner': player.isOwner,
            'bg-admin': player.isAdmin,
          }"
        >
          <span class="text-lg">{{ player.name }}</span>
          <button
            @click="openPlayerModal(player)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700"
          >
            Actions
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">

export default class Community {

// FIRST COLUMN
  // FETCH DATA FROM QUERY
  chatRooms = [
    { id: 1, name: 'Room 1' },
    { id: 2, name: 'Room 2' },
    { id: 3, name: 'Room 3' },
  ];
//---------------------------------------------

  // State for showing/hiding the chatroom creation modal
  showCreateChatroomModal = false;

  // Data for creating a new chatroom
  newChatroom = {
    name: '',
    password: '',
  };


  joinRoom(roomId: number) {
    console.log(`Joining room ${roomId}`);
  }


  // Function to create a chatroom (implement as needed)
  createChatroom() {
    // Add your logic here to create a new chatroom
    console.log('Creating chatroom:', this.newChatroom);
    
    // Close the modal after creating the chatroom
    this.showCreateChatroomModal = false;
    
    // Reset the chatroom creation form
    this.newChatroom = { name: '', password: '' };
  }


// SECOND COLUMN 
chatMessages = [
    { id: 1, playerName: 'Player 1', content: 'Hello', isOwner: true, isAdmin: true },
    { id: 2, playerName: 'Player 2', content: 'Hi there', isOwner: false, isAdmin: true },
    { id: 3, playerName: 'Player 1', content: 'How are you?', isOwner: true, isAdmin: true },
    // Add more chat messages as needed
  ];

  

// THIRD COLUMN

// FETCH PLAYERS W/ QUERY 
players = [
    { id: 1, name: 'Player 1', isOwner: true, isAdmin: true },
    { id: 2, name: 'Player 2', isOwner: false, isAdmin: true },
    { id: 3, name: 'Player 3', isOwner: false, isAdmin: false },
    // Add more players as needed
  ];
// ------------------------------------------------------

  // Function to open the player modal with actions
  openPlayerModal(player: { id: number; name: string }) {
    // Implement modal logic to show actions (invite to game, view profile, etc.)
    console.log(`Opening actions for ${player.name}`);
  }
}
</script>

<style scoped>
/* Custom styles for different player types */
.bg-owner {
  background-color: #ffcc00; /* Distinct color for channel owner */
}

.bg-admin {
  background-color: #ff6666; /* Distinct color for administrators */
}

/* Custom text colors for player names */
.text-owner {
  color: #ffcc00; /* Distinct color for channel owner's name */
}

.text-admin {
  color: #ff6666; /* Distinct color for administrators' names */
}

</style>

  