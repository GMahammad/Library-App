package com.luv2code.springbootlibrary.service;

import com.luv2code.springbootlibrary.dao.MessageRepository;
import com.luv2code.springbootlibrary.entity.Message;
import com.luv2code.springbootlibrary.requestmodels.AdminMessageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Service
@Transactional
public class MessageService {
    private MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest,String userEmail){
        Message message = new Message(messageRequest.getQuestion(),messageRequest.getTitle());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }
    public void putMessage(AdminMessageRequest adminMessageRequest,String userEmail) throws Exception{
        Optional<Message> message = messageRepository.findById(adminMessageRequest.getId());
        if(!message.isPresent()){
           throw new Exception("Message not found!");
        }
        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminMessageRequest.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());

    }
}
