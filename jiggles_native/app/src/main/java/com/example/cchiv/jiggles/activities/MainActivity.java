package com.example.cchiv.jiggles.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.example.cchiv.jiggles.Constants;
import com.example.cchiv.jiggles.R;
import com.squareup.picasso.Picasso;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SharedPreferences sharedPreferences = getSharedPreferences(Constants.AUTH_TOKEN, MODE_PRIVATE);
        if(sharedPreferences.getString(Constants.TOKEN, null) != null) {
            Intent intent = new Intent(this, HomeActivity.class);

            startActivity(intent);
        }

        ImageView welcomeBackground = findViewById(R.id.welcome_background);
        Picasso.get()
                .load(R.drawable.background)
                .resize(600, 600)
                .into(welcomeBackground);
    }

    public void onClickGetStarted(View view) {
        String authType = null;
        switch(view.getId()) {
            case R.id.get_started : {
                authType = Constants.AUTH_SIGN_UP;
                break;
            }
            case R.id.welcome_sign_in : {
                authType = Constants.AUTH_SIGN_IN;
                break;
            }
            case R.id.welcome_sign_up : {
                authType = Constants.AUTH_SIGN_UP;
                break;
            }
            default : {
                Log.v("MainActivity", "Unknown command");
            }
        }

        if(authType != null) {
            Intent intent;

            SharedPreferences sharedPreferences = getSharedPreferences(Constants.AUTH_TOKEN, MODE_PRIVATE);
            if(sharedPreferences.getString(Constants.TOKEN, null) != null)
                intent = new Intent(this, HomeActivity.class);
            else {
                intent = new Intent(this, AuthActivity.class);
                intent.putExtra(Constants.AUTH_TYPE_KEY, authType);
            }

            startActivity(intent);
        }
    }
}