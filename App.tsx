import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    mediaDevices,
    RTCView,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
} from 'react-native-webrtc';

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

function App() {
    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:6789');
        const pc = new RTCPeerConnection(configuration);

        mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setStream(stream); // Display in your local video component if necessary
                stream.getTracks().forEach(track => pc.addTrack(track, stream));
            })
            .catch(error => console.error(error));
        
        pc.createOffer({})
            .then((offer: RTCSessionDescriptionInit) => {
                pc.setLocalDescription(offer);
                console.log('Offer:', JSON.stringify(offer));
            })
            .catch(error => console.error(error));

        setPeerConnection(pc);

        ws.onopen = () => {
            console.log('Connected to the signaling server');
        };

        ws.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log('Got message:', message);
            if (message.type === 'answer') {
                pc.setRemoteDescription(new RTCSessionDescription(message));
                pc.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                }
            }
        };

        ws.onerror = (e) => {
            console.error('Error:', e);
        }
    }, []);

    // These functions should be triggered by UI elements or manually via developer tools for testing

    const createOffer = async () => {
        if (peerConnection) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('Offer created:', JSON.stringify(offer));
            // Manually send this offer to the remote peer
        }
    };

    const setRemoteDescription = async (answer) => {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    };

    return (
        <View style={styles.container}>
            {stream && <RTCView streamURL={stream.toURL()} style={styles.video} />}
            {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.video} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: 300,
        height: 300,
    },
});

export default App;
